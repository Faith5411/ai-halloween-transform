# 🎁 PROMO CODES & TEST CARDS

## 🎃 FREE FIRST MONTH - PROMO CODES

Share these codes with users for **100% OFF their first month**!

Each code can be used **ONCE** by a single user.

### How to Use:
1. Click "Subscribe Now" on any plan
2. At Stripe checkout, click "Add promotion code"
3. Enter one of these codes
4. Get first month FREE! 🎉

---

## 📋 20 GIFT CODES (One-time use each):

```
SPOOKY1001
SPOOKY1002
SPOOKY1003
SPOOKY1004
SPOOKY1005
SPOOKY1006
SPOOKY1007
SPOOKY1008
SPOOKY1009
SPOOKY1010
SPOOKY1011
SPOOKY1012
SPOOKY1013
SPOOKY1014
SPOOKY1015
SPOOKY1016
SPOOKY1017
SPOOKY1018
SPOOKY1019
SPOOKY1020
```

### Code Details:
- ✅ **Discount**: 100% off first month
- ✅ **Duration**: One month only (then normal price)
- ✅ **Max uses per code**: 1 person
- ✅ **Total codes**: 20
- ✅ **Applies to**: All subscription plans (Basic, Pro, Magic)

---

## 💳 STRIPE TEST CARDS (Development Only)

**⚠️ IMPORTANT**: These only work in TEST MODE!

### ✅ Successful Payment Cards:

#### Visa (Most Common)
```
Card Number: 4242 4242 4242 4242
Expiration: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

#### Mastercard
```
Card Number: 5555 5555 5555 4444
Expiration: 12/34
CVC: 123
ZIP: 12345
```

#### American Express
```
Card Number: 3782 822463 10005
Expiration: 12/34
CVC: 1234 (4 digits for Amex)
ZIP: 12345
```

#### Discover
```
Card Number: 6011 1111 1111 1117
Expiration: 12/34
CVC: 123
ZIP: 12345
```

### ❌ Test Decline Cards (for testing error handling):

#### Generic Decline
```
Card Number: 4000 0000 0000 0002
```

#### Insufficient Funds
```
Card Number: 4000 0000 0000 9995
```

#### Lost Card
```
Card Number: 4000 0000 0000 9987
```

#### Stolen Card
```
Card Number: 4000 0000 0000 9979
```

#### Expired Card
```
Card Number: 4000 0000 0000 0069
```

---

## 🎯 MARKETING IDEAS FOR PROMO CODES

### Social Media:
```
🎃 HALLOWEEN SPECIAL! 🎃

Get your first month FREE with code: SPOOKY1001

Transform your photos with AI-powered costumes!
👻 100+ costumes to choose from
✨ Instant transformations
🎬 Video generation (Magic tier)

Claim your code now: [Your App Link]

#Halloween #AI #PhotoEditor #Promo
```

### Email Campaign:
```
Subject: 🎃 Your FREE First Month Awaits!

Hi [Name],

Ready to transform your Halloween photos with AI magic?

We're giving away 20 FREE first-month subscriptions!

Your exclusive code: SPOOKY10XX

👉 Click here to claim: [App Link]

Choose any plan:
• Basic ($4.99/mo) - 10 transforms
• Pro ($14.99/mo) - 30 transforms  
• Magic ($29.99/mo) - 35 transforms + videos

First month is on us! 🎉

Hurry - only one use per code!
```

### Reddit/Forums:
```
[Giveaway] 20 FREE months of AI Halloween Transform! 🎃

I'm giving away 20 promo codes for FREE first month of our AI costume app.

Features:
- 100+ Halloween costumes
- AI-powered transformations
- Video generation
- Instant results

Comment below and I'll DM you a code!
(First 20 comments only)
```

---

## 📊 TRACKING USAGE

### Check Code Redemptions:

Go to Stripe Dashboard:
1. Products → Coupons
2. Find coupon: "Launch Promotion - Free First Month"
3. View redemption count

Or check specific promo code:
1. Products → Promotion codes
2. Search for "SPOOKY"
3. See which codes have been used

---

## 🔄 CREATE MORE CODES

Need more promo codes? Run this:

```bash
cd stripe-mcp-server
STRIPE_SECRET_KEY=your_key node -e "
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

(async () => {
  const coupon = await stripe.coupons.retrieve('isYX6ujT');
  
  for (let i = 21; i <= 30; i++) {
    await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: 'SPOOKY' + (1000 + i),
      max_redemptions: 1
    });
    console.log('Created: SPOOKY' + (1000 + i));
  }
})();
"
```

---

## ⚠️ SECURITY REMINDERS

- ✅ Test cards only work in Stripe TEST mode
- ✅ Promo codes are one-time use each
- ✅ Never share your Stripe SECRET key
- ✅ Monitor coupon usage to prevent abuse
- ✅ Set expiration dates if needed

---

## 🎉 READY TO SHARE!

Your promo codes are live and ready to use!

**Coupon ID**: `isYX6ujT`
**Total Codes**: 20
**Value**: $4.99 - $29.99 per redemption
**Total Value**: Up to $599.80 in free subscriptions!

---

**Happy launching! 🎃🚀**