# Quick Start Guide: Stripe MCP Server for Zed

Get your Stripe MCP server running in Zed in 5 minutes!

## Prerequisites

- Node.js 18 or higher
- A Stripe account (free at https://stripe.com)
- Zed editor installed

## Step 1: Get Your Stripe Secret Key

1. Go to https://dashboard.stripe.com
2. Click "Developers" → "API keys"
3. Copy your "Secret key" (starts with `sk_test_` for test mode)
4. **Important**: Keep this key secret!

## Step 2: Install Dependencies

```bash
cd "ai-haloween 2/stripe-mcp-server"
npm install
```

## Step 3: Build the Server

```bash
npm run build
```

This will create the `dist/` folder with the compiled server.

## Step 4: Configure Zed

1. Open Zed's settings:
   - Linux: `~/.config/zed/settings.json`
   - macOS: `~/Library/Application Support/Zed/settings.json`
   - Windows: `%APPDATA%\Zed\settings.json`

2. Add the MCP server configuration:

```json
{
  "context_servers": {
    "stripe-mcp": {
      "command": "node",
      "args": ["/FULL/PATH/TO/ai-haloween 2/stripe-mcp-server/dist/index.js"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_YOUR_KEY_HERE"
      }
    }
  }
}
```

**Replace**:
- `/FULL/PATH/TO/` with your actual path (e.g., `/home/jdog/ai-haloween 2/stripe-mcp-server/dist/index.js`)
- `sk_test_YOUR_KEY_HERE` with your actual Stripe secret key

3. Save the file

## Step 5: Restart Zed

Close and reopen Zed for the changes to take effect.

## Step 6: Test It!

Open Zed's assistant and try these commands:

### Test 1: List Products
```
List all my Stripe products
```

### Test 2: Create a Test Product
```
Create a new Stripe product called "Test Product" with description "This is a test"
```

### Test 3: List Payment Links
```
Show me all my Stripe payment links
```

## Common Issues

### "STRIPE_SECRET_KEY environment variable is required"

**Solution**: Double-check that you've added the `env` section in your Zed config with your secret key.

### Server not starting

**Solution**: 
1. Make sure you ran `npm run build`
2. Check that the path in your Zed config is correct
3. Look at Zed's output panel for error messages

### "Invalid API Key provided"

**Solution**: 
1. Copy your key again from Stripe Dashboard
2. Make sure it starts with `sk_test_` or `sk_live_`
3. Remove any extra spaces or quotes

## What's Next?

Now you can:

1. **Create products and prices** for your AI Halloween Transform app
2. **Generate payment links** for quick checkout
3. **Manage subscriptions** directly from Zed
4. **View customer information** and invoices

## Example Workflow: Setting Up Your App's Payment Plans

```
1. "Create a Stripe product called 'AI Halloween Transform Basic' with description 'Basic plan with 10 transforms per month'"
2. "Create a monthly price of $4.99 for product prod_xxx" (use the product ID from step 1)
3. "Create a payment link for price price_xxx" (use the price ID from step 2)
4. Copy the payment link URL and add it to your app's constants-stripe.ts
```

## Security Reminder

- ✅ Use `sk_test_` keys for development
- ✅ Use `sk_live_` keys only for production
- ❌ NEVER commit keys to Git
- ❌ NEVER share keys publicly

## Need Help?

Check the full README.md for:
- Complete API reference
- All available tools
- Troubleshooting guide
- Security best practices

## Switching to Production

When you're ready to go live:

1. In Stripe Dashboard, switch from "Test mode" to "Live mode"
2. Copy your **live** secret key (`sk_live_...`)
3. Update your Zed config with the live key
4. Restart Zed

**Important**: Test thoroughly in test mode first!

---

🎃 Happy coding with Stripe MCP Server!