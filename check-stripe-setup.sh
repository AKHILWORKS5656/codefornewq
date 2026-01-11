#!/bin/bash

# ============================================================================
# 🎯 STRIPE BACKEND QUICK START CHECKLIST
# ============================================================================
# Run this script to verify your Stripe setup is ready to go!
# ============================================================================

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         Beauzead Stripe Payment Backend Setup Check           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_mark() {
    echo -e "${GREEN}✓${NC} $1"
}

cross_mark() {
    echo -e "${RED}✗${NC} $1"
}

warning_mark() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        check_mark "Found: $1"
        return 0
    else
        cross_mark "Missing: $1"
        return 1
    fi
}

# Function to check if command exists
command_exists() {
    if command -v "$1" &> /dev/null; then
        check_mark "Installed: $1"
        return 0
    else
        cross_mark "Not installed: $1"
        return 1
    fi
}

echo "📋 CHECKING PROJECT STRUCTURE..."
echo ""

all_good=true

# Check backend files
echo "Backend Files:"
check_file "backend/server.ts" || all_good=false
check_file "backend/routes/payments.ts" || all_good=false
check_file "backend/routes/webhooks.ts" || all_good=false
check_file "backend/utils/stripeHelpers.ts" || all_good=false
check_file "backend/utils/errorHandler.ts" || all_good=false

echo ""
echo "Frontend Files:"
check_file "src/utils/stripeClient.ts" || all_good=false
check_file "src/components/PaymentPage.tsx" || all_good=false

echo ""
echo "Configuration Files:"
check_file ".env.local" || all_good=false
check_file "package.json" || all_good=false
check_file "backend/tsconfig.json" || all_good=false

echo ""
echo "Documentation:"
check_file "STRIPE_SETUP.md" || all_good=false
check_file "backend/README.md" || all_good=false
check_file "IMPLEMENTATION_SUMMARY.md" || all_good=false

echo ""
echo "🔧 CHECKING DEPENDENCIES..."
echo ""

# Check if Node.js is installed
command_exists "node" || all_good=false

# Check if npm is installed
command_exists "npm" || all_good=false

echo ""
echo "📦 CHECKING ENVIRONMENT VARIABLES..."
echo ""

# Check .env.local for required keys
if grep -q "STRIPE_SECRET_KEY" .env.local; then
    warning_mark "STRIPE_SECRET_KEY is set (but may be placeholder)"
else
    cross_mark "STRIPE_SECRET_KEY not found in .env.local"
    all_good=false
fi

if grep -q "VITE_STRIPE_PUBLISHABLE_KEY" .env.local; then
    warning_mark "VITE_STRIPE_PUBLISHABLE_KEY is set (but may be placeholder)"
else
    cross_mark "VITE_STRIPE_PUBLISHABLE_KEY not found in .env.local"
    all_good=false
fi

if grep -q "VITE_API_BASE_URL" .env.local; then
    check_mark "VITE_API_BASE_URL is configured"
else
    cross_mark "VITE_API_BASE_URL not found in .env.local"
    all_good=false
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    SETUP INSTRUCTIONS                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "1️⃣  GET YOUR STRIPE KEYS:"
echo "   • Go to: https://dashboard.stripe.com/apikeys"
echo "   • Copy your test keys (pk_test_... and sk_test_...)"
echo ""

echo "2️⃣  UPDATE .env.local:"
echo "   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE"
echo "   STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE"
echo "   STRIPE_WEBHOOK_SECRET=whsec_test_YOUR_KEY_HERE"
echo ""

echo "3️⃣  INSTALL DEPENDENCIES:"
echo "   npm install"
echo ""

echo "4️⃣  RUN DEVELOPMENT SERVERS:"
echo "   npm run dev:all"
echo "   "
echo "   This starts both:"
echo "   • Frontend: http://localhost:5173"
echo "   • Backend:  http://localhost:3000"
echo ""

echo "5️⃣  TEST A PAYMENT:"
echo "   • Add a product to cart"
echo "   • Proceed to checkout"
echo "   • Use test card: 4242 4242 4242 4242"
echo "   • Any future date for expiry"
echo "   • Any CVC (e.g., 123)"
echo ""

echo "6️⃣  CHECK PAYMENT DASHBOARD:"
echo "   • Go to: https://dashboard.stripe.com/payments"
echo "   • You should see your test payment"
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    USEFUL COMMANDS                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "Frontend only:"
echo "  npm run dev"
echo ""

echo "Backend only:"
echo "  npm run dev:server"
echo ""

echo "Both (Recommended):"
echo "  npm run dev:all"
echo ""

echo "Build for production:"
echo "  npm run build:server"
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                      DOCUMENTATION                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "📖 Read these files for detailed information:"
echo ""
echo "  • STRIPE_SETUP.md          - Complete setup & troubleshooting"
echo "  • backend/README.md        - Backend API documentation"
echo "  • IMPLEMENTATION_SUMMARY.md - What was added"
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"

if [ "$all_good" = true ]; then
    echo -e "${GREEN}✓ All checks passed! You're ready to go!${NC}"
else
    echo -e "${YELLOW}⚠ Some checks failed. See instructions above.${NC}"
fi

echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 Next step: npm run dev:all"
echo ""
