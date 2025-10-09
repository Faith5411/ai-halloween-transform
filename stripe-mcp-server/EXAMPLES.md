# Stripe MCP Server - Usage Examples

Practical examples for using the Stripe MCP server in Zed.

## Table of Contents

- [Basic Examples](#basic-examples)
- [Setting Up Payment Plans](#setting-up-payment-plans)
- [Managing Customers](#managing-customers)
- [Subscription Management](#subscription-management)
- [Payment Links](#payment-links)
- [Real-World Workflows](#real-world-workflows)

## Basic Examples

### List All Products

**Prompt:**
```
List all my Stripe products
```

**What happens:** The server retrieves all products from your Stripe account.

### Create a Product

**Prompt:**
```
Create a Stripe product called "Premium Plan" with description "Access to all premium features"
```

**What happens:** Creates a new product in your Stripe account.

### List Prices for a Product

**Prompt:**
```
Show me all prices for product prod_ABC123
```

**What happens:** Lists all pricing options for a specific product.

### Create a Monthly Price

**Prompt:**
```
Create a monthly subscription price of $9.99 for product prod_ABC123
```

**What happens:** Creates a recurring monthly price in cents (999 cents = $9.99).

### Create a One-Time Price

**Prompt:**
```
Create a one-time payment price of $29.99 for product prod_ABC123
```

**What happens:** Creates a one-time payment price (no recurring billing).

## Setting Up Payment Plans

### Complete Setup for AI Halloween Transform

**Prompt:**
```
I need to set up three subscription products for my AI Halloween Transform app:
1. Basic Plan - $4.99/month - 10 transforms per month
2. Pro Plan - $9.99/month - Unlimited transforms
3. Magic Plan - $19.99/month - Premium features + priority processing

Create the products, prices, and payment links for each.
```

**Result:** The assistant will:
1. Create three products
2. Create three monthly recurring prices
3. Generate three payment links
4. Provide you with the URLs to add to your app

### Step-by-Step Setup

**Step 1: Create Basic Product**
```
Create a Stripe product named "AI Halloween Transform - Basic" with description "Basic plan: 10 Halloween costume transforms per month, standard processing, 100 costumes to choose from"
```

**Step 2: Create Basic Price**
```
Create a monthly price of $4.99 for product prod_[ID from step 1]
```

**Step 3: Create Basic Payment Link**
```
Create a payment link for price price_[ID from step 2]
```

**Repeat for Pro and Magic plans.**

## Managing Customers

### Find a Customer by Email

**Prompt:**
```
Find the Stripe customer with email john@example.com
```

**What happens:** Searches for and retrieves customer details.

### List Recent Customers

**Prompt:**
```
Show me the last 20 customers who signed up
```

**What happens:** Lists your 20 most recent customers.

### Get Customer Details

**Prompt:**
```
Get details for customer cus_ABC123
```

**What happens:** Retrieves full customer information including subscriptions.

## Subscription Management

### List Active Subscriptions

**Prompt:**
```
Show me all active subscriptions
```

**What happens:** Lists all currently active subscriptions.

### List Subscriptions for a Customer

**Prompt:**
```
Show all subscriptions for customer cus_ABC123
```

**What happens:** Lists all subscriptions (active, canceled, etc.) for a specific customer.

### Cancel a Subscription

**Prompt:**
```
Cancel subscription sub_ABC123 immediately without prorating
```

**What happens:** Cancels the subscription right away.

### List Past Due Subscriptions

**Prompt:**
```
Show me all past_due subscriptions
```

**What happens:** Lists subscriptions with failed payments.

## Payment Links

### Create a Simple Payment Link

**Prompt:**
```
Create a payment link for price price_ABC123
```

**What happens:** Generates a shareable checkout URL.

### List All Payment Links

**Prompt:**
```
Show me all my active payment links
```

**What happens:** Lists all payment links you've created.

### Create Multiple Payment Links

**Prompt:**
```
I have three prices (price_123, price_456, price_789). Create a payment link for each one.
```

**What happens:** Creates three separate payment links.

## Real-World Workflows

### Workflow 1: Launch a New Product

**Prompt:**
```
I'm launching a new product called "Halloween Photo Bundle" for $14.99 one-time payment. 
Set up the product, price, and payment link, then give me the checkout URL to add to my website.
```

**Steps the assistant performs:**
1. Creates product: "Halloween Photo Bundle"
2. Creates one-time price: $14.99
3. Generates payment link
4. Provides the checkout URL

### Workflow 2: Upgrade a Customer

**Prompt:**
```
Customer cus_ABC123 wants to upgrade from Basic to Pro. 
Show me their current subscription and tell me how to upgrade them.
```

**Steps the assistant performs:**
1. Retrieves customer details
2. Lists their current subscriptions
3. Explains how to update the subscription

### Workflow 3: Monthly Revenue Check

**Prompt:**
```
Show me:
1. How many active subscriptions I have
2. The breakdown by plan (Basic, Pro, Magic)
3. Any past due subscriptions that need attention
```

**Steps the assistant performs:**
1. Lists all active subscriptions
2. Filters and counts by product
3. Checks for past_due status

### Workflow 4: Customer Support

**Prompt:**
```
A customer with email support@example.com says they were charged twice. 
Find their customer record, show their recent invoices, and check for duplicate payments.
```

**Steps the assistant performs:**
1. Finds customer by email
2. Lists their invoices
3. Shows payment intents to check for duplicates

### Workflow 5: End of Month Analysis

**Prompt:**
```
Give me a summary of:
1. Total number of customers
2. Active vs canceled subscriptions
3. Recent invoices (paid, unpaid, failed)
```

**Steps the assistant performs:**
1. Lists customers with count
2. Lists subscriptions filtered by status
3. Lists invoices with status breakdown

## Advanced Examples

### Create a Tiered Pricing Model

**Prompt:**
```
Create a product "Pro Analytics" with three pricing tiers:
- Monthly: $29/month
- Quarterly: $79 every 3 months
- Yearly: $299/year
```

**What happens:** Creates one product with three different recurring price options.

### Create a Free Trial

**Prompt:**
```
Create a monthly price of $9.99 for product prod_ABC123 with a 14-day free trial
```

**Note:** Free trials are configured in the Checkout Session, not the price itself. The assistant can guide you through this.

### Checkout Session with Custom URLs

**Prompt:**
```
Create a checkout session for price price_ABC123 with:
- Success URL: https://myapp.com/success?session_id={CHECKOUT_SESSION_ID}
- Cancel URL: https://myapp.com/pricing
```

**What happens:** Creates a checkout session with custom redirect URLs.

## AI Halloween Transform Specific Examples

### Setup All Three Plans at Once

**Prompt:**
```
Set up my three AI Halloween Transform subscription plans:

Basic ($4.99/month):
- Product name: "AI Halloween Transform - Basic"
- Description: "10 transforms/month, standard processing, 100 costumes"

Pro ($9.99/month):
- Product name: "AI Halloween Transform - Pro"  
- Description: "Unlimited transforms, fast processing, 100 costumes"

Magic ($19.99/month):
- Product name: "AI Halloween Transform - Magic"
- Description: "Unlimited transforms, priority processing, 100+ exclusive costumes"

Create products, prices, and payment links for all three.
```

### Update Payment Links in Code

**After creating payment links, prompt:**
```
I have these payment links:
- Basic: https://buy.stripe.com/test_xyz123
- Pro: https://buy.stripe.com/test_xyz456  
- Magic: https://buy.stripe.com/test_xyz789

Show me how to update my constants-stripe.ts file with these URLs.
```

### Monitor App Subscriptions

**Prompt:**
```
Show me how many users are subscribed to each tier:
- Basic (product prod_basic123)
- Pro (product prod_pro456)
- Magic (product prod_magic789)
```

## Tips for Best Results

1. **Be specific** - Include product IDs, price amounts, and details
2. **Ask for summaries** - Request formatted output when needed
3. **Chain requests** - "Create X, then create Y for X"
4. **Request guidance** - Ask "How do I..." for explanations
5. **Use context** - Reference previous results by ID

## Common Patterns

### Pattern: Create → Get ID → Use ID

```
1. "Create a product called 'Test Product'"
2. (Note the product ID: prod_ABC123)
3. "Create a price of $10 for product prod_ABC123"
4. (Note the price ID: price_XYZ789)
5. "Create a payment link for price price_XYZ789"
```

### Pattern: Find → Analyze → Act

```
1. "Find customer with email user@example.com"
2. "Show subscriptions for customer cus_ABC123"
3. "Cancel subscription sub_XYZ789"
```

### Pattern: List → Filter → Report

```
1. "List all subscriptions"
2. "Filter to show only active ones"
3. "Count how many are on each plan"
```

## Error Handling Examples

### When a Product Doesn't Exist

**Prompt:**
```
Create a price for product prod_INVALID
```

**Response:** Error message explaining the product doesn't exist.

### When a Price Amount is Wrong

**Prompt:**
```
Create a monthly price of $9.99 for product prod_ABC123
```

**Note:** The server automatically converts dollars to cents (999).

---

**Pro Tip:** You can combine multiple operations in one prompt! The assistant will execute them in sequence and provide all the results.