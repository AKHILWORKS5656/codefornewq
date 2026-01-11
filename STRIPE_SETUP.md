# 🎯 Stripe Payment Backend Setup Guide

Complete guide to set up and integrate Stripe payment processing with your Beauzead Ecommerce platform.

## ✅ What's Included

Your project now has a **production-ready Stripe integration** with:

```
✅ Express.js backend server
✅ Stripe Checkout Sessions API
✅ Payment Intent creation for custom forms
✅ Webhook event handling (payments, refunds, subscriptions)
✅ Customer management utilities
✅ Comprehensive error handling
✅ TypeScript support throughout
✅ CORS security configuration
✅ Frontend Stripe client utilities
```

## 📦 New Project Structure

```
codefornewq/
├── backend/                          # NEW: Backend payment server
│   ├── server.ts                    # Express app initialization
│   ├── routes/
│   │   ├── payments.ts             # Checkout & Payment Intent endpoints
│   │   └── webhooks.ts             # Stripe webhook handlers
│   ├── utils/
│   │   ├── stripeHelpers.ts        # Stripe API utilities
│   │   └── errorHandler.ts         # Error management
│   ├── README.md                   # Backend documentation
│   └── tsconfig.json              # TypeScript configuration
├── src/
│   ├── utils/
│   │   └── stripeClient.ts         # NEW: Frontend Stripe utilities
│   ├── components/
│   │   └── PaymentPage.tsx         # UPDATED: Uses backend Stripe
│   └── ...
├── package.json                    # UPDATED: Added Stripe packages
├── .env.local                      # UPDATED: Stripe environment vars
└── ...
```

## 🔧 Installation Steps

### Step 1: Install Dependencies
```bash
npm install
```

This installs:
- `stripe` - Stripe Node.js SDK
- `express` - Web framework
- `cors` - Cross-origin request handling
- `dotenv` - Environment variable management
- TypeScript types and tools

### Step 2: Get Stripe API Keys

1. **Create/Login to Stripe Account:**
   - Go to https://stripe.com
   - Create free account or login

2. **Get API Keys:**
   - Go to https://dashboard.stripe.com/apikeys
   - You'll see two types of keys:
     - **Publishable Key**: Start with `pk_test_` (for frontend)
     - **Secret Key**: Start with `sk_test_` (for backend)

3. **Enable Test Mode:**
   - Use toggle in top right to switch to Test mode
   - Test keys start with `pk_test_` and `sk_test_`

### Step 3: Set Environment Variables

Update `.env.local`:

```bash
# Stripe Payment Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_test_YOUR_KEY_HERE

# API Configuration
VITE_API_BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
PORT=3000
```

### Step 4: Test Stripe Keys

To verify your keys are correct, the backend will validate them on startup.

### Step 5: Set Up Webhooks (For Production)

For local development testing:

1. **Install Stripe CLI:**
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Linux
   curl https://raw.githubusercontent.com/stripe/stripe-cli/master/install.sh -s | sudo bash
   
   # Windows - Download from: https://github.com/stripe/stripe-cli/releases
   ```

2. **Login to Stripe CLI:**
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Copy webhook secret:**
   - CLI output shows: `Ready to accept webhook events`
   - Copy the secret and add to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

## 🚀 Running the Application

### Option 1: Frontend Only (Development)
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: Not running (checkout will fail)

### Option 2: Backend Only
```bash
npm run dev:server
```
- Backend: http://localhost:3000
- Frontend: Not running

### Option 3: Both Frontend & Backend (Recommended)
```bash
npm run dev:all
```
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Both running concurrently

## 💳 Testing Payments

### Using Stripe Test Cards

Use these test card numbers in Stripe Checkout:

| Card | Number | CVC | Expiry | Result |
|------|--------|-----|--------|--------|
| Visa | 4242 4242 4242 4242 | Any 3 digits | Any future date | ✅ Succeeds |
| Visa | 4000 0000 0000 0002 | Any 3 digits | Any future date | ❌ Declines |
| Amex | 3782 822463 10005 | Any 4 digits | Any future date | ✅ Succeeds |

**Test Details:**
- Name: Any text
- Email: Any valid format
- Address: Any address
- Postal Code: Any 5 digits

### Payment Flow

1. **Visit Checkout:** Browse product → Add to cart → Checkout
2. **Enter Details:** Shipping address and payment info
3. **Test Card:** Use `4242 4242 4242 4242`
4. **Complete:** Click "Pay" → Redirected to Stripe
5. **Verify:** Check Stripe Dashboard for payment

## 📊 Monitoring Payments

### Stripe Dashboard
- **Payments:** https://dashboard.stripe.com/payments
- **Customers:** https://dashboard.stripe.com/customers
- **Webhooks:** https://dashboard.stripe.com/webhooks
- **Logs:** https://dashboard.stripe.com/logs

### Backend Logs
Watch your terminal for payment events:
```
✅ Checkout session completed: cs_test_xxxxx
💳 Amount: 99.99 USD
📧 Customer: customer@example.com
```

## 🔒 Security Checklist

- [ ] Never commit `.env.local` with real keys
- [ ] Use test keys (`pk_test_`, `sk_test_`) for development
- [ ] Enable webhook signature verification (already done)
- [ ] Validate all payment amounts on backend
- [ ] Store customer email securely
- [ ] Log all payment transactions
- [ ] Implement rate limiting for production
- [ ] Use HTTPS for production frontend & backend
- [ ] Rotate API keys regularly

## 🐛 Common Issues & Solutions

### Issue: "Backend connection refused"
**Error:** `Error: connect ECONNREFUSED 127.0.0.1:3000`

**Solution:**
```bash
# Make sure backend is running
npm run dev:server

# Or run both frontend & backend
npm run dev:all
```

### Issue: "Stripe key is invalid"
**Error:** `Invalid API key provided`

**Solution:**
1. Go to https://dashboard.stripe.com/apikeys
2. Verify keys start with `pk_test_` and `sk_test_`
3. Copy exact key without spaces
4. Update `.env.local`
5. Restart backend

### Issue: "Webhook secret not found"
**Error:** `Missing webhook signature or secret`

**Solution:**
1. For testing, generate webhook secret from CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
2. Copy secret to `.env.local`
3. Restart backend

### Issue: "CORS error"
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Verify `FRONTEND_URL=http://localhost:5173` in `.env.local`
- Restart backend after changing

### Issue: "Payment amount is too small"
**Error:** `Amount must be a positive integer`

**Solution:**
- Minimum amount is $0.50 USD
- Ensure product price is correct
- Check currency conversion is working

## 📚 API Reference Quick Guide

### Create Checkout Session
```bash
POST http://localhost:3000/api/payments/create-checkout-session

{
  "productId": "prod_123",
  "quantity": 1,
  "currency": "USD",
  "amount": 99.99,
  "userEmail": "customer@example.com"
}
```

### Retrieve Session Status
```bash
POST http://localhost:3000/api/payments/retrieve-session

{
  "sessionId": "cs_test_xxxxx"
}
```

### Health Check
```bash
GET http://localhost:3000/health

# Response
{
  "status": "ok",
  "timestamp": "2024-01-11T...",
  "environment": "development"
}
```

## 🎓 Next Steps

1. **Test Payments:** Use test cards to verify flow
2. **Check Dashboard:** View payments in Stripe Dashboard
3. **Review Logs:** Check backend terminal for events
4. **Set Up Email:** Add confirmation emails for orders
5. **Implement Database:** Store orders in database
6. **Handle Webhooks:** Process refunds, subscriptions
7. **Go to Production:** Use live keys with proper security

## 📖 Documentation

- **Backend Docs:** See `backend/README.md`
- **Stripe Docs:** https://stripe.com/docs
- **API Reference:** https://stripe.com/docs/api

## ✨ Features Ready for Development

The following are now available for integration:

- [x] One-time payments via Checkout
- [x] Custom payment forms (Payment Intent)
- [x] Customer management
- [x] Refund processing framework
- [x] Subscription support framework
- [x] Webhook event handling
- [x] Error handling & logging
- [x] TypeScript type safety

## 🆘 Getting Help

1. **Stripe Support:** https://support.stripe.com
2. **Stripe Docs:** https://stripe.com/docs
3. **API Status:** https://status.stripe.com
4. **Community:** Stack Overflow (tag: `stripe`)

---

**Your Stripe backend is now ready to accept payments!** 🎉

Start the servers and test a payment flow. You're good to go! 🚀
