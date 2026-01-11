# Stripe Payment Backend Integration

Complete Stripe payment processing backend for the Beauzead Ecommerce Platform.

## 📋 Overview

This backend provides:
- ✅ Stripe Checkout Session management
- ✅ Payment Intent creation for custom forms
- ✅ Webhook event handling (payments, subscriptions, refunds)
- ✅ Customer management
- ✅ Payment history tracking
- ✅ Error handling and logging
- ✅ CORS support for frontend communication

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ 
- npm or yarn
- Stripe account (create at https://stripe.com)

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get Stripe API Keys:**
   - Go to https://dashboard.stripe.com/apikeys
   - Copy your **Publishable Key** and **Secret Key**
   - Set up webhooks for local testing using Stripe CLI

3. **Configure Environment Variables:**
   ```bash
   # .env.local
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
   STRIPE_SECRET_KEY=sk_test_xxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxx
   VITE_API_BASE_URL=http://localhost:3000
   FRONTEND_URL=http://localhost:5173
   PORT=3000
   NODE_ENV=development
   ```

4. **Start Backend Server:**
   ```bash
   npm run dev:server
   ```

5. **Run Both Frontend & Backend:**
   ```bash
   npm run dev:all
   ```

## 🏗️ Project Structure

```
backend/
├── server.ts                 # Express server & middleware setup
├── routes/
│   ├── payments.ts          # Payment endpoints (checkout, payment intent)
│   └── webhooks.ts          # Stripe webhook handlers
└── utils/
    ├── stripeHelpers.ts     # Stripe API wrapper functions
    └── errorHandler.ts      # Error handling utilities
```

## 📡 API Endpoints

### Payment Endpoints

#### 1. Create Checkout Session
**POST** `/api/payments/create-checkout-session`

Creates a Stripe Checkout session for one-time payments.

**Request Body:**
```json
{
  "productId": "prod_123",
  "quantity": 2,
  "currency": "USD",
  "amount": 99.99,
  "userEmail": "customer@example.com",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "US"
  },
  "metadata": {
    "orderId": "order_123",
    "customField": "value"
  }
}
```

**Response:**
```json
{
  "id": "cs_test_xxxxx",
  "url": "https://checkout.stripe.com/pay/cs_test_xxxxx",
  "clientSecret": "cs_test_xxxxx_secret_xxxxx"
}
```

#### 2. Retrieve Checkout Session
**POST** `/api/payments/retrieve-session`

Get details of an existing checkout session.

**Request Body:**
```json
{
  "sessionId": "cs_test_xxxxx"
}
```

**Response:**
```json
{
  "id": "cs_test_xxxxx",
  "payment_status": "paid",
  "customer_email": "customer@example.com",
  "amount_total": 9999,
  "currency": "usd",
  "metadata": { ... }
}
```

#### 3. Create Payment Intent
**POST** `/api/payments/create-payment-intent`

Creates a payment intent for custom payment forms (not Stripe Checkout).

**Request Body:**
```json
{
  "amount": 99.99,
  "currency": "USD",
  "description": "Order #123",
  "metadata": {
    "orderId": "order_123"
  }
}
```

**Response:**
```json
{
  "clientSecret": "pi_test_xxxxx_secret_xxxxx",
  "id": "pi_test_xxxxx"
}
```

### Webhook Endpoint

#### Stripe Webhooks
**POST** `/api/webhooks/stripe`

Receives and processes Stripe webhook events. Requires signature verification.

**Supported Events:**
- `checkout.session.completed` - Payment successful
- `charge.succeeded` - Charge processed
- `charge.failed` - Charge failed
- `payment_intent.succeeded` - Payment intent succeeded
- `payment_intent.payment_failed` - Payment intent failed
- `customer.subscription.created` - Subscription created
- `customer.subscription.updated` - Subscription updated
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.paid` - Invoice paid
- `invoice.payment_failed` - Invoice payment failed
- `refund.created` - Refund initiated
- `refund.updated` - Refund status changed

## 🔒 Security Features

### CORS Protection
- Frontend URL whitelist via `FRONTEND_URL` environment variable
- Credentials support for cross-origin requests

### Webhook Verification
- Signature verification using `STRIPE_WEBHOOK_SECRET`
- Prevents unauthorized webhook requests

### Authentication
- Bearer token support via `Authorization` header
- Optional implementation: Add JWT token validation

### Data Validation
- Request body validation for required fields
- Amount validation (must be > 0)
- Currency format validation

## 🛠️ Development Guide

### Running Tests
```bash
npm run test
```

### Type Checking
```bash
npx tsc --noEmit
```

### Building for Production
```bash
npm run build:server
```

### Running Production Build
```bash
npm start
```

## 📝 Usage Examples

### Frontend Integration

**1. Handle Checkout:**
```typescript
import { createCheckoutSession } from '@/utils/stripeClient';

const handlePayment = async () => {
  const session = await createCheckoutSession({
    productId: 'prod_123',
    quantity: 1,
    currency: 'USD',
    amount: 99.99,
    userEmail: user.email,
    shippingAddress: { ... }
  });
  
  window.location.href = session.url;
};
```

**2. Check Payment Status:**
```typescript
import { getPaymentStatus } from '@/utils/stripeClient';

const status = await getPaymentStatus(sessionId);
if (status.isPaid) {
  // Process order
}
```

### Backend Webhook Handling

**Complete Order on Payment:**
```typescript
// In webhooks.ts
case 'checkout.session.completed': {
  const session = event.data.object;
  // TODO: Update database order status to 'paid'
  // TODO: Send confirmation email
  // TODO: Trigger fulfillment process
  break;
}
```

## 🐛 Troubleshooting

### Issue: "Webhook signature verification failed"
**Solution:** Ensure `STRIPE_WEBHOOK_SECRET` is correctly set in `.env.local`

### Issue: "CORS error when making requests"
**Solution:** Verify `FRONTEND_URL` in `.env.local` matches your frontend origin

### Issue: "Payment intent requires payment method"
**Solution:** Ensure payment method is attached before confirming intent

### Issue: Charges not appearing in Stripe Dashboard
**Solution:** Check that `STRIPE_SECRET_KEY` is the test secret key (starts with `sk_test_`)

## 📚 Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Checkout Guide](https://stripe.com/docs/payments/checkout)
- [Webhook Events Reference](https://stripe.com/docs/api/events)
- [Testing Stripe Integration](https://stripe.com/docs/testing)

## 🔐 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `STRIPE_SECRET_KEY` | Yes | Stripe secret API key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Webhook endpoint secret |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key (frontend) |
| `VITE_API_BASE_URL` | Yes | Backend API URL (frontend) |
| `FRONTEND_URL` | Yes | Frontend URL for CORS |
| `PORT` | No | Server port (default: 3000) |
| `NODE_ENV` | No | Environment (development/production) |

## 📞 Support

For issues or questions:
1. Check [Stripe Documentation](https://stripe.com/docs)
2. Review error logs in terminal
3. Test with [Stripe Test Card](https://stripe.com/docs/testing#cards): `4242 4242 4242 4242`

## 🚀 Next Steps

- [ ] Set up database integration for order persistence
- [ ] Implement customer authentication
- [ ] Add refund processing
- [ ] Set up email notifications
- [ ] Configure production environment
- [ ] Set up monitoring and analytics
- [ ] Implement payment retry logic
