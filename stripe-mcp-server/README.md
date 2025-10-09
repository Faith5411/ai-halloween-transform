# Stripe MCP Server

A Model Context Protocol (MCP) server that provides Stripe API integration for Zed editor and other MCP-compatible clients.

## Features

This MCP server provides tools to interact with your Stripe account:

### Products & Prices
- **list_products** - List all products in your Stripe account
- **create_product** - Create a new product
- **list_prices** - List all prices
- **create_price** - Create a new price for a product

### Payment Links
- **list_payment_links** - List all payment links
- **create_payment_link** - Create a payment link for quick checkout

### Customers
- **get_customer** - Retrieve a customer by ID or email
- **list_customers** - List all customers

### Checkout & Subscriptions
- **create_checkout_session** - Create a Checkout Session
- **list_subscriptions** - List all subscriptions
- **cancel_subscription** - Cancel a subscription

### Invoices & Payments
- **list_invoices** - List all invoices
- **get_payment_intent** - Retrieve a payment intent

## Installation

1. Navigate to the stripe-mcp-server directory:
```bash
cd stripe-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the server:
```bash
npm run build
```

## Configuration

### Set up your Stripe Secret Key

You need to provide your Stripe secret key. **IMPORTANT**: Never commit your secret key to version control!

Create a `.env` file or set the environment variable:
```bash
export STRIPE_SECRET_KEY=sk_test_...
```

For production, use your live key:
```bash
export STRIPE_SECRET_KEY=sk_live_...
```

### Configure Zed Editor

Add the following to your Zed settings file (`~/.config/zed/settings.json` on Linux):

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

**Replace the path and key with your actual values.**

### Alternative: Use npx (after publishing)

If you publish this to npm, you can use:
```json
{
  "context_servers": {
    "stripe-mcp": {
      "command": "npx",
      "args": ["stripe-mcp-server"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_YOUR_KEY_HERE"
      }
    }
  }
}
```

## Usage Examples

Once configured, you can interact with Stripe from Zed's assistant:

### Example 1: List Products
```
"List all my Stripe products"
```

### Example 2: Create a Product
```
"Create a new Stripe product called 'Pro Plan' with description 'Advanced features for power users'"
```

### Example 3: Create a Price
```
"Create a monthly subscription price of $9.99 for product prod_xxx"
```

### Example 4: List Payment Links
```
"Show me all my Stripe payment links"
```

### Example 5: Create a Payment Link
```
"Create a payment link for price price_xxx"
```

### Example 6: List Subscriptions
```
"Show me all active subscriptions"
```

### Example 7: Get Customer
```
"Find the customer with email user@example.com"
```

## Security Best Practices

1. **Never commit secret keys** - Use environment variables
2. **Use test mode** during development (`sk_test_...`)
3. **Use live mode** only in production (`sk_live_...`)
4. **Restrict key permissions** in Stripe Dashboard if possible
5. **Rotate keys** regularly
6. **Monitor usage** in your Stripe Dashboard

## Development

### Watch Mode
```bash
npm run watch
```

### Run Locally
```bash
npm run dev
```

### Build
```bash
npm run build
```

## Troubleshooting

### "STRIPE_SECRET_KEY environment variable is required"
- Make sure you've set the `STRIPE_SECRET_KEY` in your Zed configuration
- Check that the key starts with `sk_test_` or `sk_live_`

### "Invalid API Key"
- Verify your key is correct in the Stripe Dashboard
- Make sure there are no extra spaces or quotes

### Server not responding
- Check Zed's output panel for errors
- Verify the path to `dist/index.js` is correct
- Try rebuilding with `npm run build`

### Tool not found
- Restart Zed after configuration changes
- Check the MCP server logs in Zed's output panel

## Tools Reference

### list_products
```typescript
{
  limit?: number;  // default: 10, max: 100
  active?: boolean;
}
```

### create_product
```typescript
{
  name: string;          // required
  description?: string;
  active?: boolean;      // default: true
}
```

### create_price
```typescript
{
  product: string;       // required (product ID)
  unit_amount: number;   // required (cents, e.g., 999 = $9.99)
  currency: string;      // required (e.g., "usd")
  recurring?: {
    interval: "day" | "week" | "month" | "year";
    interval_count?: number;  // default: 1
  };
}
```

### create_payment_link
```typescript
{
  line_items: Array<{
    price: string;       // required (price ID)
    quantity?: number;   // default: 1
  }>;
}
```

### create_checkout_session
```typescript
{
  line_items: Array<{
    price: string;       // required
    quantity?: number;   // default: 1
  }>;
  mode: "payment" | "subscription" | "setup";  // default: "subscription"
  success_url: string;   // required
  cancel_url: string;    // required
}
```

## Contributing

Feel free to submit issues or pull requests!

## License

MIT