import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

/**
 * Retrieve customer by email
 */
export async function getOrCreateCustomer(email: string, name?: string) {
  const customers = await stripe.customers.list({ email, limit: 1 });

  if (customers.data.length > 0) {
    return customers.data[0];
  }

  return stripe.customers.create({
    email,
    name: name || email.split('@')[0],
  });
}

/**
 * Retrieve payment intent by ID
 */
export async function getPaymentIntent(intentId: string) {
  return stripe.paymentIntents.retrieve(intentId);
}

/**
 * Confirm payment intent
 */
export async function confirmPaymentIntent(intentId: string, paymentMethod: string) {
  return stripe.paymentIntents.confirm(intentId, {
    payment_method: paymentMethod,
  });
}

/**
 * Create refund
 */
export async function createRefund(chargeId: string, amount?: number, reason?: string) {
  return stripe.refunds.create({
    charge: chargeId,
    amount: amount ? Math.round(amount * 100) : undefined,
    reason: (reason as Stripe.RefundCreateParams.Reason) || 'requested_by_customer',
  });
}

/**
 * List customer payments
 */
export async function getCustomerPayments(customerId: string, limit: number = 10) {
  const charges = await stripe.charges.list({
    customer: customerId,
    limit,
  });

  return charges.data.map(charge => ({
    id: charge.id,
    amount: charge.amount / 100,
    currency: charge.currency.toUpperCase(),
    status: charge.status,
    description: charge.description,
    created: new Date(charge.created * 1000),
    receiptUrl: charge.receipt_url,
  }));
}

/**
 * Handle customer refund
 */
export async function processCustomerRefund(email: string, amount: number, reason: string) {
  const customer = await getOrCreateCustomer(email);
  const charges = await stripe.charges.list({
    customer: customer.id,
    limit: 1,
  });

  if (charges.data.length === 0) {
    throw new Error('No charges found for customer');
  }

  return createRefund(charges.data[0].id, amount, reason);
}

/**
 * Get subscription details
 */
export async function getSubscriptionDetails(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return {
    id: subscription.id,
    status: subscription.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
    items: subscription.items.data.map(item => ({
      id: item.id,
      priceId: item.price.id,
      quantity: item.quantity,
    })),
  };
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string, atPeriodEnd: boolean = false) {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: atPeriodEnd,
  });
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  });

  return formatter.format(amount / 100);
}
