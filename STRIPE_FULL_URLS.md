# Complete Stripe Redirect URLs

## Full URL Examples

Based on your code in `components/Pricing.tsx`, here are the **exact full URLs** that will be constructed when users click "Subscribe Now":

### For Local Development (http://localhost:5173)

#### Basic Tier ($4.99/mo)
```
https://buy.stripe.com/28E14n4rYeqafJNbDz73G02?client_reference_id=basic&success_url=http%3A%2F%2Flocalhost%3A5173%2F%3Fpayment%3Dsuccess%26tier%3Dbasic&cancel_url=http%3A%2F%2Flocalhost%3A5173%2F%3Fpayment%3Dcanceled
```

**Decoded success URL**: `http://localhost:5173/?payment=success&tier=basic`
**Decoded cancel URL**: `http://localhost:5173/?payment=canceled`

#### Pro Tier ($14.99/mo)
```
https://buy.stripe.com/9B67sL4rY3Lw0OT4b773G05?client_reference_id=pro&success_url=http%3A%2F%2Flocalhost%3A5173%2F%3Fpayment%3Dsuccess%26tier%3Dpro&cancel_url=http%3A%2F%2Flocalhost%3A5173%2F%3Fpayment%3Dcanceled
```

**Decoded success URL**: `http://localhost:5173/?payment=success&tier=pro`
**Decoded cancel URL**: `http://localhost:5173/?payment=canceled`

#### Magic Tier ($29.99/mo)
```
https://buy.stripe.com/eVqeVd8Ie3Lw2X1ePL73G06?client_reference_id=magic&success_url=http%3A%2F%2Flocalhost%3A5173%2F%3Fpayment%3Dsuccess%26tier%3Dmagic&cancel_url=http%3A%2F%2Flocalhost%3A5173%2F%3Fpayment%3Dcanceled
```

**Decoded success URL**: `http://localhost:5173/?payment=success&tier=magic`
**Decoded cancel URL**: `http://localhost:5173/?payment=canceled`

---

### For Production (e.g., https://your-domain.com)

#### Basic Tier ($4.99/mo)
```
https://buy.stripe.com/28E14n4rYeqafJNbDz73G02?client_reference_id=basic&success_url=https%3A%2F%2Fyour-domain.com%2F%3Fpayment%3Dsuccess%26tier%3Dbasic&cancel_url=https%3A%2F%2Fyour-domain.com%2F%3Fpayment%3Dcanceled
```

**Decoded success URL**: `https://your-domain.com/?payment=success&tier=basic`
**Decoded cancel URL**: `https://your-domain.com/?payment=canceled`

#### Pro Tier ($14.99/mo)
```
https://buy.stripe.com/9B67sL4rY3Lw0OT4b773G05?client_reference_id=pro&success_url=https%3A%2F%2Fyour-domain.com%2F%3Fpayment%3Dsuccess%26tier%3Dpro&cancel_url=https%3A%2F%2Fyour-domain.com%2F%3Fpayment%3Dcanceled
```

**Decoded success URL**: `https://your-domain.com/?payment=success&tier=pro`
**Decoded cancel URL**: `https://your-domain.com/?payment=canceled`

#### Magic Tier ($29.99/mo)
```
https://buy.stripe.com/eVqeVd8Ie3Lw2X1ePL73G06?client_reference_id=magic&success_url=https%3A%2F%2Fyour-domain.com%2F%3Fpayment%3Dsuccess%26tier%3Dmagic&cancel_url=https%3A%2F%2Fyour-domain.com%2F%3Fpayment%3Dcanceled
```

**Decoded success URL**: `https://your-domain.com/?payment=success&tier=magic`
**Decoded cancel URL**: `https://your-domain.com/?payment=canceled`

---

## How the Code Builds These URLs

From `components/Pricing.tsx` lines 36-51:

1. **Gets the base payment link** from `constants-stripe.ts`
2. **Gets the current app URL** using `window.location.origin`
3. **Constructs success URL**: `${appUrl}/?payment=success&tier=${tier}`
4. **Constructs cancel URL**: `${appUrl}/?payment=canceled`
5. **Builds the full URL** with URL-encoded parameters:
   - `client_reference_id=${tier}` - Stripe uses this to identify the tier
   - `success_url=${encodeURIComponent(successUrl)}` - Where to go after successful payment
   - `cancel_url=${encodeURIComponent(cancelUrl)}` - Where to go if user cancels

## Important Notes

1. **URL Encoding**: The success and cancel URLs are URL-encoded (that's why you see `%3A` for `:`, `%2F` for `/`, `%3F` for `?`, `%26` for `&`)

2. **Dynamic Origin**: The code uses `window.location.origin` which automatically adapts to:
   - `http://localhost:5173` during development
   - Your production domain when deployed

3. **Stripe Dashboard Configuration**: Some Stripe Payment Links may ignore programmatically passed URLs for security. You may need to configure these in the Stripe Dashboard under each payment link's settings.

4. **Testing**: You can test these URLs by:
   - Opening your browser's developer console
   - Clicking a "Subscribe Now" button
   - Checking the Network tab to see the exact URL being called

## Transform Pack URLs (One-Time Purchases)

Similarly, for the transform packs:

#### 5 Transforms ($2.99)
```
https://buy.stripe.com/bJeeVd0bI81M9lp0YV73G07
```

#### 10 Transforms ($4.99)
```
https://buy.stripe.com/8x28wP0bIci2cxB4b773G08
```

#### 25 Transforms ($9.99)
```
https://buy.stripe.com/14A5kDcYuci24156jf73G09
```

Note: Transform packs don't currently pass redirect URLs in the code (`BuyMoreTransforms.tsx`), so these need to be configured in the Stripe Dashboard if you want redirects for them too.