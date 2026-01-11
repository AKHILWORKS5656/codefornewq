/**
 * Stripe Error Handling Utilities
 */

export class StripeErrorHandler {
  static handleError(error: any) {
    if (error.type === 'StripeCardError') {
      // Card was declined
      return {
        status: 'card_declined',
        message: error.message,
        code: error.code,
      };
    } else if (error.type === 'StripeRateLimitError') {
      // Too many requests made to the API too quickly
      return {
        status: 'rate_limit',
        message: 'Too many requests. Please try again later.',
      };
    } else if (error.type === 'StripeInvalidRequestError') {
      // Invalid parameters were supplied to Stripe's API
      return {
        status: 'invalid_request',
        message: error.message,
      };
    } else if (error.type === 'StripeAPIError') {
      // Problem on Stripe's servers
      return {
        status: 'api_error',
        message: 'A problem occurred on Stripe servers. Please try again.',
      };
    } else if (error.type === 'StripeAuthenticationError') {
      // Authentication with Stripe's API failed
      return {
        status: 'auth_error',
        message: 'Authentication failed.',
      };
    } else {
      // Handle generic errors
      return {
        status: 'unknown_error',
        message: error.message || 'An unknown error occurred.',
      };
    }
  }

  static isPaymentError(error: any): boolean {
    return error.type?.includes('Stripe') || error.raw?.type?.includes('stripe');
  }

  static shouldRetry(error: any): boolean {
    return (
      error.type === 'StripeRateLimitError' ||
      error.type === 'StripeAPIError' ||
      (error.raw?.status >= 500)
    );
  }
}

/**
 * Validate payment details
 */
export function validatePaymentDetails(details: any) {
  const errors: string[] = [];

  if (!details.amount || details.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }

  if (!details.currency) {
    errors.push('Currency is required');
  }

  if (details.currency && !/^[a-z]{3}$/i.test(details.currency)) {
    errors.push('Currency must be a valid 3-letter code');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Format error response
 */
export function formatErrorResponse(error: any, statusCode: number = 400) {
  return {
    statusCode,
    error: StripeErrorHandler.handleError(error),
    timestamp: new Date().toISOString(),
  };
}
