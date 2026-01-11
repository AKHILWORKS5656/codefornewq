import express, { Request, Response, Router } from 'express';
import Stripe from 'stripe';

const router: Router = express.Router();

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

// Get webhook secret from environment
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

interface WebhookEvent {
  type: string;
  data: {
    object: Record<string, unknown>;
  };
}

/**
 * POST /api/webhooks/stripe
 * Handles Stripe webhook events
 * Verify webhook by setting STRIPE_WEBHOOK_SECRET in environment
 */
router.post('/stripe', express.raw({ type: 'application/json' }), async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;

  if (!sig || !webhookSecret) {
    res.status(400).json({ error: 'Missing webhook signature or secret' });
    return;
  }

  let event: WebhookEvent;

  try {
    // Verify webhook signature
    const rawBody = req.body;
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret) as WebhookEvent;
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    res.status(400).json({ error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}` });
    return;
  }

  try {
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`✅ Checkout session completed: ${session.id}`);
        console.log(`Payment status: ${session.payment_status}`);
        console.log(`Customer email: ${session.customer_email}`);
        console.log(`Metadata:`, session.metadata);

        // TODO: Update order status in database
        // TODO: Send confirmation email to customer
        // TODO: Process seller payout
        break;
      }

      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge;
        console.log(`✅ Charge succeeded: ${charge.id}`);
        console.log(`Amount: ${charge.amount / 100} ${charge.currency.toUpperCase()}`);
        // TODO: Update payment records
        break;
      }

      case 'charge.failed': {
        const charge = event.data.object as Stripe.Charge;
        console.error(`❌ Charge failed: ${charge.id}`);
        console.error(`Failure reason: ${charge.failure_message}`);
        // TODO: Notify customer of failed payment
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`✅ Payment intent succeeded: ${paymentIntent.id}`);
        // TODO: Mark order as paid
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error(`❌ Payment intent failed: ${paymentIntent.id}`);
        // TODO: Notify customer
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`✅ Subscription created: ${subscription.id}`);
        // TODO: Handle subscription
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`✅ Subscription updated: ${subscription.id}`);
        // TODO: Update subscription in database
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`✅ Subscription cancelled: ${subscription.id}`);
        // TODO: Handle subscription cancellation
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`✅ Invoice paid: ${invoice.id}`);
        // TODO: Process invoice
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.error(`❌ Invoice payment failed: ${invoice.id}`);
        // TODO: Notify customer
        break;
      }

      case 'refund.created': {
        const refund = event.data.object as Stripe.Refund;
        console.log(`✅ Refund created: ${refund.id}`);
        console.log(`Amount: ${refund.amount / 100} ${refund.currency?.toUpperCase()}`);
        // TODO: Update refund status in database
        break;
      }

      case 'refund.updated': {
        const refund = event.data.object as Stripe.Refund;
        console.log(`✅ Refund updated: ${refund.id} - Status: ${refund.status}`);
        break;
      }

      default: {
        console.log(`Unhandled event type: ${event.type}`);
      }
    }

    // Acknowledge receipt of event
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Webhook handler error' });
  }
});

export default router;
