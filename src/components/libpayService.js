// libpayService.js
const LIBPAY_BASE_URL = 'https://libpayapp.liberianpost.com:3000';

class LibPayService {
  // Check user balance
  async getBalance(userEmail) {
    try {
      const response = await fetch(`${LIBPAY_BASE_URL}/user-balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch balance');
      return await response.json();
    } catch (error) {
      console.error('Error fetching LibPay balance:', error);
      throw error;
    }
  }

  // Send payment request
  async requestPayment(payerEmail, amount, currency, description, merchantInfo) {
    try {
      const response = await fetch(`${LIBPAY_BASE_URL}/payment-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payerEmail,
          amount,
          currency,
          description,
          merchantInfo
        })
      });
      
      if (!response.ok) throw new Error('Payment request failed');
      return await response.json();
    } catch (error) {
      console.error('Error requesting payment:', error);
      throw error;
    }
  }

  // Check payment status
  async checkPaymentStatus(paymentRequestId) {
    try {
      const response = await fetch(`${LIBPAY_BASE_URL}/payment-status/${paymentRequestId}`);
      
      if (!response.ok) throw new Error('Failed to check payment status');
      return await response.json();
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  }

  // Send money to LibPay user (for withdrawals)
  async sendMoney(senderEmail, recipientContact, amount, currency = 'USD') {
    try {
      const response = await fetch(`${LIBPAY_BASE_URL}/send-money`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderEmail,
          contact: recipientContact,
          amount,
          currency
        }),
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Send money failed');
      return await response.json();
    } catch (error) {
      console.error('Error sending money:', error);
      throw error;
    }
  }

  // Lookup user by contact info
  async lookupUser(contact) {
    try {
      const response = await fetch(`${LIBPAY_BASE_URL}/lookup-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contact })
      });
      
      if (!response.ok) throw new Error('User lookup failed');
      return await response.json();
    } catch (error) {
      console.error('Error looking up user:', error);
      throw error;
    }
  }
}

export default new LibPayService();
