# Stripe Redirect URL Configuration

## Overview
Your app needs to handle redirects back from Stripe after successful or canceled payments. Here's how to configure the redirect URLs for all three subscription tiers.

## Current Payment Links
- **Basic ($4.99/mo)**: `https://buy.stripe.com/28E14n4rYeqafJNbDz73G02`
- **Pro ($14.99/mo)**: `https://buy.stripe.com/9B67sL4rY3Lw0OT4b773G05`
- **Magic ($29.99/mo)**: `https://buy.stripe.com/eVqeVd8Ie3Lw2X1ePL73G06`

## Stripe Dashboard Configuration

### For Each Payment Link:

1. **Log into Stripe Dashboard**
2. **Navigate to Payment Links** (Products → Payment Links)
3. **Find and Edit each payment link**

### Configure Success URL:
For each tier, set the success URL with the appropriate tier parameter:

#### Basic Tier:
- **Success URL**: `{CHECKOUT_SESSION_URL}?payment=success&tier=basic`
- **Cancel URL**: `{CHECKOUT_SESSION_URL}?payment=canceled`

#### Pro Tier:
- **Success URL**: `{CHECKOUT_SESSION_URL}?payment=success&tier=pro`
- **Cancel URL**: `{CHECKOUT_SESSION_URL}?payment=canceled`

#### Magic Tier:
- **Success URL**: `{CHECKOUT_SESSION_URL}?payment=success&tier=magic`
- **Cancel URL**: `{CHECKOUT_SESSION_URL}?payment=canceled`

**Note**: `{CHECKOUT_SESSION_URL}` is a Stripe variable that automatically uses the originating URL.

## Alternative: Use Absolute URLs

If you prefer to use absolute URLs (replace `YOUR_DOMAIN` with your actual domain):

#### Basic Tier:
- **Success URL**: `https://YOUR_DOMAIN.com/?payment=success&tier=basic`
- **Cancel URL**: `https://YOUR_DOMAIN.com/?payment=canceled`

#### Pro Tier:
- **Success URL**: `https://YOUR_DOMAIN.com/?payment=success&tier=pro`
- **Cancel URL**: `https://YOUR_DOMAIN.com/?payment=canceled`

#### Magic Tier:
- **Success URL**: `https://YOUR_DOMAIN.com/?payment=success&tier=magic`
- **Cancel URL**: `https://YOUR_DOMAIN.com/?payment=canceled`

## How It Works

1. User clicks "Subscribe Now" on your website
2. They're redirected to Stripe Checkout
3. After payment:
   - **Success**: Redirects to your app with `?payment=success&tier=[tier_name]`
   - **Cancel**: Redirects to your app with `?payment=canceled`
4. Your app (App.tsx) detects these URL parameters and:
   - Shows success message
   - Updates user's subscription tier
   - Cleans the URL

## Testing the Flow

1. Click each "Subscribe Now" button
2. Complete or cancel the payment
3. Verify you're redirected back to your app
4. Check that the success message appears
5. Verify the user's tier is updated correctly

## Important Notes

- The app already handles these URL parameters in `App.tsx` (lines 58-98)
- The tier information is crucial for updating the user's subscription level
- Make sure to test both success and cancel flows for each tier
- Consider setting up webhooks for more reliable subscription tracking