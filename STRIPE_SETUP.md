# 💳 Stripe Payment Setup Guide

## 🚀 Quick Start (15 minutes)

### Step 1: Create Stripe Account

1. Go to: https://dashboard.stripe.com/register
2. Sign up (free - no charges until you go live)
3. Complete account verification

---

### Step 2: Get Your API Keys

1. In Stripe Dashboard: https://dashboard.stripe.com/test/apikeys
2. Copy these keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

⚠️ **Keep Secret key PRIVATE!** Never commit to git!

---

### Step 3: Create Subscription Products

#### A. Create Products & Prices in Stripe Dashboard

1. Go to: https://dashboard.stripe.com/test/products
2. Click **"+ Add product"**

#### Basic Plan:
- Name: `AI Halloween - Basic`
- Description: `Upload photos and use preset costumes`
- **Pricing:**
  - Model: `Recurring`
  - Price: `$4.99`
  - Billing period: `Monthly`
- Click **"Save product"**
- **Copy the Price ID** (starts with `price_`)

#### Pro Plan:
- Name: `AI Halloween - Pro`
- Description: `All Basic features plus custom prompts`
- **Pricing:**
  - Model: `Recurring`
  - Price: `$12.99`
  - Billing period: `Monthly`
- Click **"Save product"**
- **Copy the Price ID**

#### Magic Plan:
- Name: `AI Halloween - Magic`
- Description: `All Pro features plus video generation`
- **Pricing:**
  - Model: `Recurring`
  - Price: `$29.99`
  - Billing period: `Monthly`
- Click **"Save product"**
- **Copy the Price ID**

---

### Step 4: Add Environment Variables

Update your `.env.local` file:

```env
# Gemini API (existing)
GEMINI_API_KEY=your_key_here

# Stripe Keys (add these)
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxx

# Stripe Price IDs
STRIPE_PRICE_BASIC=price_xxxxxxxxxxxxxxxxxx
STRIPE_PRICE_PRO=price_xxxxxxxxxxxxxxxxxx
STRIPE_PRICE_MAGIC=price_xxxxxxxxxxxxxxxxxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### Step 5: Create Stripe Checkout Endpoint

Since this is a frontend-only app, you have 3 options:

#### **Option A: Use Vercel Serverless Functions** (Recommended)

Create `api/create-checkout-session.ts`:

```typescript
import Stripe from 'stripe';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, customerEmail } = req.body;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
```

#### **Option B: Use Stripe Payment Links** (No Code!)

1. In Stripe Dashboard: https://dashboard.stripe.com/test/payment-links
2. Click **"+ New"**
3. For each plan:
   - Select the product/price
   - Configure success/cancel URLs
   - Copy the payment link
4. Use these links directly in your app buttons!

**Easiest but less customizable**

#### **Option C: Use a Backend Service**

Set up a separate API server (Node.js, Python, etc.) to handle Stripe

---

### Step 6: Simple Implementation (No Backend Required!)

For now, let's use **Stripe Payment Links** (easiest):

1. Create 3 payment links (Basic, Pro, Magic)
2. Update `Pricing.tsx` to use these links:

```typescript
const PAYMENT_LINKS = {
  basic: 'https://buy.stripe.com/test_xxxxxxx',
  pro: 'https://buy.stripe.com/test_yyyyyyy',
  magic: 'https://buy.stripe.com/test_zzzzzzz',
};

// In button click:
window.location.href = PAYMENT_LINKS[tier];
```

---

## 🔐 User Management Options

### Option 1: Stripe Customer Portal (Simplest)

Let Stripe handle everything:
- Account management
- Update payment methods
- Cancel subscriptions
- View invoices

Just redirect users to Stripe Customer Portal!

### Option 2: Add Authentication

Use one of these:
- **Clerk** (easiest): https://clerk.com
- **Auth0**: https://auth0.com
- **Supabase Auth**: https://supabase.com
- **Firebase Auth**: https://firebase.google.com

---

## ✅ Testing

### Test Cards (Stripe Test Mode):

✅ **Success:**
- Card: `4242 4242 4242 4242`
- Date: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

❌ **Decline:**
- Card: `4000 0000 0000 0002`

🔐 **Requires Authentication:**
- Card: `4000 0025 0000 3155`

More test cards: https://stripe.com/docs/testing

---

## 🚀 Going Live

### When Ready for Real Payments:

1. **Complete Stripe Account Setup:**
   - Business details
   - Bank account
   - Tax information
   - Identity verification

2. **Switch to Live Mode:**
   - Toggle in Stripe Dashboard: Test → Live
   - Get LIVE API keys (pk_live_ and sk_live_)
   - Update environment variables

3. **Create Live Products:**
   - Recreate products in Live mode
   - Get new Price IDs

4. **Update App:**
   - Replace test keys with live keys
   - Test thoroughly before launch!

---

## 💰 Stripe Fees

- **2.9% + $0.30** per successful transaction
- **No monthly fees** for basic account
- **No setup fees**
- **No hidden fees**

Example:
- $4.99 subscription = You receive ~$4.54
- $12.99 subscription = You receive ~$12.31
- $29.99 subscription = You receive ~$28.82

---

## 🎯 Implementation Checklist

### Before Launch:
- [ ] Stripe account created
- [ ] Test mode API keys obtained
- [ ] 3 subscription products created
- [ ] Price IDs copied
- [ ] Environment variables set
- [ ] Payment flow tested with test cards
- [ ] Success/cancel pages configured

### For Production:
- [ ] Stripe account verified
- [ ] Live mode activated
- [ ] Live products created
- [ ] Live API keys set
- [ ] Tested end-to-end with real card
- [ ] Webhooks configured (optional)
- [ ] Customer portal tested

---

## 🆘 Quick Help

### Common Issues:

**"Invalid API key"**
- Check you're using the right mode (test vs live)
- Ensure no extra spaces in .env file

**"No such price"**
- Verify Price ID is correct
- Check you're in the same mode (test/live)

**Payment not showing up**
- Wait ~1 minute for Stripe to process
- Check Dashboard → Payments

### Resources:
- Stripe Docs: https://stripe.com/docs
- API Reference: https://stripe.com/docs/api
- Test Mode: https://dashboard.stripe.com/test
- Support: https://support.stripe.com

---

## 🎉 Next Steps

1. Create Stripe account (5 min)
2. Set up test products (5 min)
3. Add API keys to .env.local (1 min)
4. Choose implementation (Payment Links = 2 min, API = 30 min)
5. Test with test cards (5 min)
6. Deploy to production!

**Let's make money! 💰🎃**

