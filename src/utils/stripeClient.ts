/**
 * Frontend Stripe Payment Utilities
 * Handles communication with backend Stripe API
 */

export interface CheckoutSessionRequest {
  productId: string;
  quantity: number;
  currency: string;
  amount: number;
  userEmail: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  metadata?: Record<string, string>;
}

export interface CheckoutSessionResponse {
  id: string;
  url: string;
  clientSecret: string;
}

export interface PaymentIntentRequest {
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
  description?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  id: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Create a checkout session
 */
export async function createCheckoutSession(
  data: CheckoutSessionRequest
): Promise<CheckoutSessionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('beauzead_auth_token') || ''}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    return await response.json();
  } catch (error) {
    console.error('Checkout session creation error:', error);
    throw error;
  }
}

/**
 * Retrieve checkout session details
 */
export async function retrieveCheckoutSession(sessionId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/retrieve-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('beauzead_auth_token') || ''}`,
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve session');
    }

    return await response.json();
  } catch (error) {
    console.error('Retrieve session error:', error);
    throw error;
  }
}

/**
 * Create a payment intent for custom payment forms
 */
export async function createPaymentIntent(
  data: PaymentIntentRequest
): Promise<PaymentIntentResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('beauzead_auth_token') || ''}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Payment intent creation error:', error);
    throw error;
  }
}

/**
 * Check if checkout session is successful
 */
export async function isCheckoutSuccessful(sessionId: string): Promise<boolean> {
  try {
    const session = await retrieveCheckoutSession(sessionId);
    return session.payment_status === 'paid';
  } catch (error) {
    console.error('Error checking payment status:', error);
    return false;
  }
}

/**
 * Get payment status details
 */
export async function getPaymentStatus(sessionId: string) {
  try {
    const session = await retrieveCheckoutSession(sessionId);
    return {
      isPaid: session.payment_status === 'paid',
      status: session.payment_status,
      email: session.customer_email,
      amount: session.amount_total ? (session.amount_total / 100).toFixed(2) : '0',
      currency: session.currency?.toUpperCase(),
      metadata: session.metadata,
    };
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw error;
  }
}

/**
 * Format amount for Stripe (convert to cents)
 */
export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Format amount for display (convert from cents)
 */
export function formatAmountForDisplay(amount: number): string {
  return (amount / 100).toFixed(2);
}

/**
 * Handle payment errors
 */
export function handlePaymentError(error: any): string {
  if (error.message) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An error occurred during payment processing. Please try again.';
}
