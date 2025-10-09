# Stripe MCP Server - Installation Checklist

Complete this checklist to ensure your Stripe MCP server is properly installed and configured for Zed.

## ☑️ Prerequisites

- [ ] Node.js 18+ installed (check with `node --version`)
- [ ] Zed editor installed
- [ ] Stripe account created (free at https://stripe.com)
- [ ] Access to your Stripe Dashboard

## 📥 Installation Steps

### 1. Dependencies
- [ ] Navigate to the stripe-mcp-server directory
  ```bash
  cd "ai-haloween 2/stripe-mcp-server"
  ```

- [ ] Install npm dependencies
  ```bash
  npm install
  ```

- [ ] Verify installation completed without errors

### 2. Build
- [ ] Build the TypeScript server
  ```bash
  npm run build
  ```

- [ ] Verify `dist/` folder was created
- [ ] Verify `dist/index.js` exists

## 🔑 Stripe API Key Setup

- [ ] Log in to Stripe Dashboard (https://dashboard.stripe.com)
- [ ] Navigate to Developers → API keys
- [ ] Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)
- [ ] Keep this key private - NEVER commit to Git!

**Your key format should be:**
- Test mode: `sk_test_51...` ✅ (use this for development)
- Live mode: `sk_live_51...` ⚠️ (use only in production)

## ⚙️ Zed Configuration

### 1. Locate Your Zed Settings File
- [ ] **Linux**: `~/.config/zed/settings.json`
- [ ] **macOS**: `~/Library/Application Support/Zed/settings.json`
- [ ] **Windows**: `%APPDATA%\Zed\settings.json`

### 2. Add MCP Server Configuration
- [ ] Open `settings.json` in your editor
- [ ] Add the following configuration (adjust the path):

```json
{
  "context_servers": {
    "stripe-mcp": {
      "command": "node",
      "args": ["/home/jdog/ai-haloween 2/stripe-mcp-server/dist/index.js"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_YOUR_KEY_HERE"
      }
    }
  }
}
```

- [ ] **Replace** `/home/jdog/ai-haloween 2/` with your actual path
- [ ] **Replace** `sk_test_YOUR_KEY_HERE` with your actual Stripe secret key
- [ ] Ensure JSON syntax is valid (no trailing commas, matching braces)
- [ ] Save the file

### 3. Restart Zed
- [ ] Close Zed completely
- [ ] Reopen Zed
- [ ] Wait for MCP servers to initialize

## ✅ Testing & Verification

### 1. Check MCP Server Status
- [ ] Open Zed
- [ ] Look for MCP server indicators in the UI
- [ ] Check for any error messages in the output panel

### 2. Test Basic Functionality
- [ ] Open Zed's AI assistant
- [ ] Try this command:
  ```
  List all my Stripe products
  ```
- [ ] Verify you get a response (even if it's an empty list)

### 3. Test Product Creation
- [ ] Try this command:
  ```
  Create a test Stripe product called "Test Product" with description "This is a test"
  ```
- [ ] Verify you receive a product ID (prod_...)
- [ ] Check Stripe Dashboard to confirm the product was created

### 4. Test Payment Link Creation
- [ ] Get a price ID from your products (or create one)
- [ ] Try this command:
  ```
  Create a payment link for price price_YOUR_PRICE_ID
  ```
- [ ] Verify you receive a payment link URL
- [ ] Test the URL in a browser (should open Stripe checkout)

## 🔍 Troubleshooting Checklist

If something isn't working, check these items:

### Server Won't Start
- [ ] Verify `npm install` completed successfully
- [ ] Verify `npm run build` completed successfully
- [ ] Check that `dist/index.js` exists
- [ ] Look for errors in Zed's output panel
- [ ] Verify Node.js version is 18 or higher

### "STRIPE_SECRET_KEY environment variable is required"
- [ ] Confirm you added the `env` section in Zed config
- [ ] Verify your secret key is inside quotes
- [ ] Check for typos in the key
- [ ] Ensure key starts with `sk_test_` or `sk_live_`

### "Invalid API Key"
- [ ] Copy the key again from Stripe Dashboard
- [ ] Remove any extra spaces before/after the key
- [ ] Verify you're not using a publishable key (pk_...)
- [ ] Check you're using the correct mode (test vs live)

### Tools Not Appearing
- [ ] Completely quit and restart Zed (not just reload)
- [ ] Verify settings.json has valid JSON syntax
- [ ] Check the file path in your config is correct (absolute path)
- [ ] Look for MCP server errors in Zed's developer console

### Commands Not Working
- [ ] Verify the MCP server shows as "running"
- [ ] Try a simple command first: "List all my Stripe products"
- [ ] Check Stripe Dashboard for API errors
- [ ] Verify your Stripe account has no restrictions

## 🎯 Next Steps

Once everything is working:

- [ ] Read `EXAMPLES.md` for usage examples
- [ ] Review `README.md` for complete API reference
- [ ] Set up your AI Halloween Transform payment plans
- [ ] Create products and prices for your app
- [ ] Generate payment links
- [ ] Update `constants-stripe.ts` with your payment link URLs

## 🚀 Production Readiness

Before going live:

- [ ] Test thoroughly with test mode keys
- [ ] Verify all payment flows work end-to-end
- [ ] Switch to live keys only when ready
- [ ] Update environment variables with live key
- [ ] Monitor Stripe Dashboard for activity
- [ ] Set up webhook notifications (optional)
- [ ] Enable Stripe Radar for fraud protection
- [ ] Review Stripe security best practices

## 📚 Documentation Reference

- [ ] `README.md` - Complete reference guide
- [ ] `QUICK_START.md` - 5-minute setup guide
- [ ] `EXAMPLES.md` - Practical usage examples
- [ ] `SETUP_COMPLETE.md` - Post-installation summary
- [ ] `.env.example` - Environment variable template

## 🔒 Security Checklist

- [ ] Never commit `.env` or secret keys to Git
- [ ] Using test keys for development
- [ ] Live keys only in production environment
- [ ] Keys stored securely (not in code)
- [ ] Regular key rotation scheduled
- [ ] Stripe Dashboard alerts enabled

## ✨ Installation Complete!

If you've checked all the boxes above, your Stripe MCP server is ready to use!

**Test it now:**
```
Open Zed assistant and type: "List all my Stripe products"
```

---

**Need Help?**
- Check `QUICK_START.md` for common issues
- Review `EXAMPLES.md` for usage patterns
- Consult Stripe docs: https://stripe.com/docs
- Check MCP docs: https://modelcontextprotocol.io

**Happy coding! 🎃💳**