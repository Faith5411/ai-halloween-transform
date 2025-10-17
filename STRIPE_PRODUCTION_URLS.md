# Stripe Production URLs for ai-halloween-transfermation.com

## Exact Full URLs for Your Production Site

These are the complete URLs that will be generated when users click "Subscribe Now" on your live site:

### Basic Tier ($4.99/mo)
**Full URL:**
```
https://buy.stripe.com/28E14n4rYeqafJNbDz73G02?client_reference_id=basic&success_url=https%3A%2F%2Fai-halloween-transfermation.com%2F%3Fpayment%3Dsuccess%26tier%3Dbasic&cancel_url=https%3A%2F%2Fai-halloween-transfermation.com%2F%3Fpayment%3Dcanceled
```

**Redirect URLs (Decoded):**
- ✅ Success: `https://ai-halloween-transfermation.com/?payment=success&tier=basic`
- ❌ Cancel: `https://ai-halloween-transfermation.com/?payment=canceled`

---

### Pro Tier ($14.99/mo)
**Full URL:**
```
https://buy.stripe.com/9B67sL4rY3Lw0OT4b773G05?client_reference_id=pro&success_url=https%3A%2F%2Fai-halloween-transfermation.com%2F%3Fpayment%3Dsuccess%26tier%3Dpro&cancel_url=https%3A%2F%2Fai-halloween-transfermation.com%2F%3Fpayment%3Dcanceled
```

**Redirect URLs (Decoded):**
- ✅ Success: `https://ai-halloween-transfermation.com/?payment=success&tier=pro`
- ❌ Cancel: `https://ai-halloween-transfermation.com/?payment=canceled`

---

### Magic Tier ($29.99/mo)
**Full URL:**
```
https://buy.stripe.com/eVqeVd8Ie3Lw2X1ePL73G06?client_reference_id=magic&success_url=https%3A%2F%2Fai-halloween-transfermation.com%2F%3Fpayment%3Dsuccess%26tier%3Dmagic&cancel_url=https%3A%2F%2Fai-halloween-transfermation.com%2F%3Fpayment%3Dcanceled
```

**Redirect URLs (Decoded):**
- ✅ Success: `https://ai-halloween-transfermation.com/?payment=success&tier=magic`
- ❌ Cancel: `https://ai-halloween-transfermation.com/?payment=canceled`

---

## Stripe Dashboard Configuration

Since Stripe Payment Links may ignore programmatically passed URLs for security, you should configure these directly in your Stripe Dashboard:

### Steps for Each Payment Link:

1. **Log into Stripe Dashboard**
2. **Go to Products → Payment Links**
3. **Find your payment link** (Basic, Pro, or Magic)
4. **Click on the link to edit it**
5. **Scroll to "After payment" section**
6. **Configure the redirect URLs:**

### Basic Tier Configuration:
- **Success URL:** `https://ai-halloween-transfermation.com/?payment=success&tier=basic`
- **Cancel URL:** `https://ai-halloween-transfermation.com/?payment=canceled`

### Pro Tier Configuration:
- **Success URL:** `https://ai-halloween-transfermation.com/?payment=success&tier=pro`
- **Cancel URL:** `https://ai-halloween-transfermation.com/?payment=canceled`

### Magic Tier Configuration:
- **Success URL:** `https://ai-halloween-transfermation.com/?payment=success&tier=magic`
- **Cancel URL:** `https://ai-halloween-transfermation.com/?payment=canceled`

---

## Transform Packs (One-Time Purchases)

For the transform packs, you should also configure redirect URLs:

### 5 Transforms ($2.99)
- **Payment Link:** `https://buy.stripe.com/bJeeVd0bI81M9lp0YV73G07`
- **Success URL:** `https://ai-halloween-transfermation.com/?payment=success&type=pack5`
- **Cancel URL:** `https://ai-halloween-transfermation.com/?payment=canceled`

### 10 Transforms ($4.99)
- **Payment Link:** `https://buy.stripe.com/8x28wP0bIci2cxB4b773G08`
- **Success URL:** `https://ai-halloween-transfermation.com/?payment=success&type=pack10`
- **Cancel URL:** `https://ai-halloween-transfermation.com/?payment=canceled`

### 25 Transforms ($9.99)
- **Payment Link:** `https://buy.stripe.com/14A5kDcYuci24156jf73G09`
- **Success URL:** `https://ai-halloween-transfermation.com/?payment=success&type=pack25`
- **Cancel URL:** `https://ai-halloween-transfermation.com/?payment=canceled`

---

## Testing Checklist

- [ ] Test Basic tier subscription flow
- [ ] Test Pro tier subscription flow
- [ ] Test Magic tier subscription flow
- [ ] Test transform pack purchases
- [ ] Verify success messages appear correctly
- [ ] Verify tier updates in user profile
- [ ] Test cancel flow returns to site properly
- [ ] Check that URL parameters are cleaned after redirect

---

## Important Notes

1. **HTTPS Required**: Your site uses HTTPS which is required for Stripe redirects
2. **Domain Spelling**: Make sure to use the exact domain `ai-halloween-transfermation.com` (note: "transfermation" not "transformation")
3. **URL Parameters**: The `tier` parameter is crucial for your app to know which subscription was purchased
4. **App Handler**: Your app already handles these redirects in `App.tsx` lines 58-98

## Support

If redirects aren't working:
1. Check Stripe Dashboard configuration
2. Verify domain spelling is correct
3. Test in incognito/private browser mode
4. Check browser console for errors
5. Ensure your Stripe account is in live mode (not test mode) for production