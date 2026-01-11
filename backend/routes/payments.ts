import express, { Request, Response, Router } from 'express';
import Stripe from 'stripe';

const router: Router = express.Router();

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

interface PaymentRequest {
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

interface CheckoutItem {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      description?: string;
      images?: string[];
      metadata?: Record<string, string>;
    };
    unit_amount: number;
  };
  quantity: number;
}

/**
 * POST /api/payments/create-checkout-session
 * Creates a Stripe checkout session for payment processing
 */
router.post('/create-checkout-session', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      productId,
      quantity,
      currency,
      amount,
      userEmail,
      shippingAddress,
      metadata = {},
    }: PaymentRequest = req.body;

    // Validate required fields
    if (!productId || !quantity || !currency || !amount || !userEmail) {
      res.status(400).json({
        error: 'Missing required fields: productId, quantity, currency, amount, userEmail',
      });
      return;
    }

    // Convert amount to cents (Stripe expects smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    // Build line items
    const lineItems: CheckoutItem[] = [
      {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: `Product ${productId}`,
            description: `Quantity: ${quantity}`,
            metadata: {
              productId,
              ...metadata,
            },
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ];

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: userEmail,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'IN', 'AU'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: currency.toLowerCase(),
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500,
              currency: currency.toLowerCase(),
            },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 3,
              },
            },
          },
        },
      ],
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/cancel`,
      metadata: {
        productId,
        quantity: quantity.toString(),
        ...metadata,
      },
    });

    res.status(200).json({
      id: session.id,
      url: session.url,
      clientSecret: session.client_secret,
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to create checkout session',
    });
  }
});

/**
 * POST /api/payments/retrieve-session
 * Retrieves an existing checkout session details
 */
router.post('/retrieve-session', async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      res.status(400).json({ error: 'Session ID is required' });
      return;
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.status(200).json({
      id: session.id,
      payment_status: session.payment_status,
      customer_email: session.customer_email,
      amount_total: session.amount_total,
      currency: session.currency,
      metadata: session.metadata,
    });
  } catch (error) {
    console.error('Retrieve session error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to retrieve session',
    });
  }
});

/**
 * POST /api/payments/create-payment-intent
 * Creates a payment intent for custom payment forms
 */
router.post('/create-payment-intent', async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, currency, metadata = {}, description } = req.body;

    if (!amount || !currency) {
      res.status(400).json({ error: 'Amount and currency are required' });
      return;
    }

    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      description: description || 'Beauzead Ecommerce Payment',
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to create payment intent',
    });
  }
});

export default router;
