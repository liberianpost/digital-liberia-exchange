import React, { useState, useEffect } from 'react';
import '../index.css';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4NndmuQHTCKh7IyQYAz3DL_r8mttyRYg",
  authDomain: "digitalliberia-notification.firebaseapp.com",
  projectId: "digitalliberia-notification",
  storageBucket: "digitalliberia-notification.appspot.com",
  messagingSenderId: "537791418352",
  appId: "1:537791418352:web:378b48439b2c9bed6dd735"
};

// Initialize Firebase
let messaging = null;
if (typeof window !== 'undefined') {
  try {
    const { initializeApp } = require('firebase/app');
    const { getMessaging, getToken, onMessage } = require('firebase/messaging');
    
    const app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
  } catch (error) {
    console.log('Firebase initialization skipped in non-browser environment');
  }
}

// Web Push VAPID public key
const vapidKey = "BEICu1bx8LKW5j7cag5tU9B2qfcejWi7QPm8a95jFODSIUNRiellygLGroK9NyWt-3WsTiUZscmS311gGXiXV7Q";

// Enhanced notification permission request
const requestNotificationPermission = async () => {
  try {
    if (!messaging) return null;
    
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('Service Worker registered:', registration);

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      
      const currentToken = await getToken(messaging, { 
        vapidKey: vapidKey,
        serviceWorkerRegistration: registration
      });
      
      if (currentToken) {
        console.log('FCM Token:', currentToken);
        localStorage.setItem('fcmToken', currentToken);
        return currentToken;
      }
    }
    return null;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

// API configuration - Use the direct backend URL (not through proxy)
const API_BASE = 'https://libpayapp.liberianpost.com:8081';

const api = {
  post: async (url, data) => {
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    
    return response.json();
  },
  
  get: async (url) => {
    const response = await fetch(`${API_BASE}${url}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    
    return response.json();
  }
};

function Login({ onLoginSuccess, onBack }) {
  const [dssn, setDssn] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [challengeId, setChallengeId] = useState(null);
  const [polling, setPolling] = useState(false);
  const [pollInterval, setPollInterval] = useState(null);
  const [pushNotificationStatus, setPushNotificationStatus] = useState(null);

  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [pollInterval]);

  const requestDSSNChallenge = async (dssn) => {
    try {
      const fcmToken = localStorage.getItem('fcmToken') || await requestNotificationPermission();
      
      const response = await api.post('/gov-services/request', { 
        dssn, 
        service: "Digital Liberia Exchange",
        fcmToken,
        requestData: {
          timestamp: new Date().toISOString(),
          service: "Digital Liberia Exchange",
          origin: window.location.origin
        }
      });
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to initiate challenge');
      }
      
      return response;
    } catch (error) {
      console.error('Error requesting DSSN challenge:', error);
      throw new Error(error.message || "Failed to initiate DSSN challenge");
    }
  };

  const pollChallengeStatus = async (challengeId) => {
    try {
      const response = await api.get(`/gov-services/status/${challengeId}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to check challenge status');
      }
      
      return response;
    } catch (error) {
      console.error('Error polling challenge status:', error);
      throw new Error(error.message || "Failed to check approval status");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setPushNotificationStatus(null);

    if (!dssn.trim()) {
      setError("Please enter your DSSN");
      setLoading(false);
      return;
    }

    try {
      const response = await requestDSSNChallenge(dssn);
      setChallengeId(response.challengeId);
      setPolling(true);
      setLoading(false);
      
      if (response.pushNotification) {
        setPushNotificationStatus({
          sent: response.pushNotification.sent,
          hasToken: response.pushNotification.hasToken,
          error: response.pushNotification.error
        });
      }
      
      const interval = setInterval(async () => {
        try {
          const statusResponse = await pollChallengeStatus(response.challengeId);
          
          if (statusResponse.status === 'approved') {
            clearInterval(interval);
            setPolling(false);
            console.log('Login approved with token:', statusResponse.govToken);
            
            // Call the success callback with user data
            onLoginSuccess({
              dssn: dssn,
              govToken: statusResponse.govToken,
              challengeId: response.challengeId,
              timestamp: new Date().toISOString()
            });
            
          } else if (statusResponse.status === 'denied') {
            clearInterval(interval);
            setPolling(false);
            setError("Access was denied on your mobile device");
          }
        } catch (error) {
          console.error('Error polling challenge status:', error);
          clearInterval(interval);
          setPolling(false);
          setError(error.message);
        }
      }, 3000);

      setPollInterval(interval);

      setTimeout(() => {
        if (polling) {
          clearInterval(interval);
          setPolling(false);
          setError("Request timed out. Please try again.");
        }
      }, 5 * 60 * 1000);

    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="back-button"
        >
          ← Back to Welcome
        </button>

        <div className="login-header">
          <div className="login-logo">
            <span className="logo-icon">₿</span>
          </div>
          <h2>Secure DSSN Verification</h2>
          <p>Enter your DSSN to access Digital Liberia Exchange</p>
        </div>
        
        <div className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {pushNotificationStatus && !pushNotificationStatus.sent && (
            <div className="warning-message">
              {!pushNotificationStatus.hasToken ? (
                "Please install the Digital Liberia mobile app to receive verification requests"
              ) : (
                `Notification error: ${pushNotificationStatus.error || 'Unknown error'}`
              )}
            </div>
          )}
          
          {polling ? (
            <div className="verification-pending">
              <div className="spinner"></div>
              <h3>Waiting for Mobile Approval</h3>
              <p>Please check your mobile app to approve this verification request.</p>
              {pushNotificationStatus?.sent && (
                <p className="notification-sent">
                  ✓ Push notification sent to your mobile device
                </p>
              )}
              <p className="challenge-id">
                Verification ID: {challengeId}
              </p>
              <p className="timeout-notice">
                This request will timeout in 5 minutes
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="dssn">Digital Social Security Number (DSSN)</label>
                <input 
                  type="text" 
                  id="dssn" 
                  value={dssn}
                  onChange={(e) => setDssn(e.target.value)}
                  placeholder="Enter your DSSN" 
                  required
                  autoFocus
                  disabled={loading}
                />
                <p className="input-help">
                  Enter your DSSN and approve the request on your mobile app
                </p>
              </div>
              
              <button 
                type="submit" 
                className="login-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Verifying...
                  </>
                ) : 'Verify with DSSN'}
              </button>
            </form>
          )}

          <div className="login-footer">
            <p className="mobile-app-info">
              Don't have the mobile app?{' '}
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  alert("The Digital Liberia mobile app is available on the App Store and Google Play Store");
                }}
              >
                Download it here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
