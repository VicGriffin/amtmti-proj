#!/bin/bash

# AMTMTI Platform Build - Deployment Verification Script
# Run this script before deploying to production

echo "🚀 AMTMTI Platform Build - Deployment Verification"
echo "================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Check Node.js
echo -n "Checking Node.js version... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ $NODE_VERSION${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Node.js not found${NC}"
    ((FAILED++))
fi

# Check npm
echo -n "Checking npm version... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ $NPM_VERSION${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ npm not found${NC}"
    ((FAILED++))
fi

# Check package.json
echo -n "Checking package.json... "
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓ Found${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ package.json not found${NC}"
    ((FAILED++))
fi

# Check TypeScript
echo -n "Checking TypeScript... "
if [ -f "tsconfig.json" ]; then
    echo -e "${GREEN}✓ Found${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ tsconfig.json not found${NC}"
    ((FAILED++))
fi

# Check Next.js config
echo -n "Checking Next.js configuration... "
if [ -f "next.config.mjs" ]; then
    echo -e "${GREEN}✓ Found${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ next.config.mjs not found${NC}"
    ((FAILED++))
fi

# Check environment template
echo -n "Checking .env template... "
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✓ Found${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ .env.example not found${NC}"
    ((FAILED++))
fi

# Check required directories
echo -n "Checking app directory... "
if [ -d "app" ]; then
    echo -e "${GREEN}✓ Found${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ app directory not found${NC}"
    ((FAILED++))
fi

echo -n "Checking components directory... "
if [ -d "components" ]; then
    echo -e "${GREEN}✓ Found${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ components directory not found${NC}"
    ((FAILED++))
fi

echo -n "Checking lib directory... "
if [ -d "lib" ]; then
    echo -e "${GREEN}✓ Found${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ lib directory not found${NC}"
    ((FAILED++))
fi

# Check for critical files
echo ""
echo "Checking critical application files..."
echo -n "  API endpoints (enrollment)... "
if [ -f "app/api/enrollment/submit/route.ts" ]; then
    echo -e "${GREEN}✓${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗${NC}"
    ((FAILED++))
fi

echo -n "  Email service... "
if [ -f "lib/email/service.ts" ]; then
    echo -e "${GREEN}✓${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗${NC}"
    ((FAILED++))
fi

echo -n "  Validation schemas... "
if [ -f "lib/validations/enrollment.ts" ]; then
    echo -e "${GREEN}✓${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗${NC}"
    ((FAILED++))
fi

echo ""
echo "================================================="
echo "Verification Results:"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "================================================="
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Ready for deployment.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Set up environment variables in your deployment platform"
    echo "2. Ensure Supabase database is configured"
    echo "3. Configure email service (Resend or SendGrid)"
    echo "4. Run: npm run build"
    echo "5. Deploy to Vercel, AWS, or your preferred platform"
    exit 0
else
    echo -e "${RED}❌ Some checks failed. Please fix the issues above.${NC}"
    exit 1
fi
