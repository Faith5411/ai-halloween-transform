#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import Stripe from 'stripe';

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error('Error: STRIPE_SECRET_KEY environment variable is required');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});

// Create MCP server
const server = new Server(
  {
    name: 'stripe-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions
const TOOLS = [
  {
    name: 'list_products',
    description: 'List all products in your Stripe account',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of products to retrieve (default: 10, max: 100)',
          default: 10,
        },
        active: {
          type: 'boolean',
          description: 'Filter by active status',
        },
      },
    },
  },
  {
    name: 'create_product',
    description: 'Create a new product in Stripe',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Product name',
        },
        description: {
          type: 'string',
          description: 'Product description',
        },
        active: {
          type: 'boolean',
          description: 'Whether the product is active',
          default: true,
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'list_prices',
    description: 'List all prices in your Stripe account',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of prices to retrieve (default: 10, max: 100)',
          default: 10,
        },
        product: {
          type: 'string',
          description: 'Filter by product ID',
        },
        active: {
          type: 'boolean',
          description: 'Filter by active status',
        },
      },
    },
  },
  {
    name: 'create_price',
    description: 'Create a new price for a product',
    inputSchema: {
      type: 'object',
      properties: {
        product: {
          type: 'string',
          description: 'Product ID',
        },
        unit_amount: {
          type: 'number',
          description: 'Price in cents (e.g., 999 for $9.99)',
        },
        currency: {
          type: 'string',
          description: 'Three-letter ISO currency code',
          default: 'usd',
        },
        recurring: {
          type: 'object',
          description: 'Recurring pricing details',
          properties: {
            interval: {
              type: 'string',
              enum: ['day', 'week', 'month', 'year'],
              description: 'Billing interval',
            },
            interval_count: {
              type: 'number',
              description: 'Number of intervals between billings',
              default: 1,
            },
          },
        },
      },
      required: ['product', 'unit_amount', 'currency'],
    },
  },
  {
    name: 'create_payment_link',
    description: 'Create a payment link for a price',
    inputSchema: {
      type: 'object',
      properties: {
        line_items: {
          type: 'array',
          description: 'Array of line items',
          items: {
            type: 'object',
            properties: {
              price: {
                type: 'string',
                description: 'Price ID',
              },
              quantity: {
                type: 'number',
                description: 'Quantity',
                default: 1,
              },
            },
            required: ['price'],
          },
        },
      },
      required: ['line_items'],
    },
  },
  {
    name: 'list_payment_links',
    description: 'List all payment links',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of links to retrieve (default: 10, max: 100)',
          default: 10,
        },
        active: {
          type: 'boolean',
          description: 'Filter by active status',
        },
      },
    },
  },
  {
    name: 'get_customer',
    description: 'Retrieve a customer by ID or email',
    inputSchema: {
      type: 'object',
      properties: {
        customer_id: {
          type: 'string',
          description: 'Customer ID (cus_xxx)',
        },
        email: {
          type: 'string',
          description: 'Customer email',
        },
      },
    },
  },
  {
    name: 'list_customers',
    description: 'List all customers',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description:
            'Number of customers to retrieve (default: 10, max: 100)',
          default: 10,
        },
        email: {
          type: 'string',
          description: 'Filter by email',
        },
      },
    },
  },
  {
    name: 'create_checkout_session',
    description: 'Create a Checkout Session for payment',
    inputSchema: {
      type: 'object',
      properties: {
        line_items: {
          type: 'array',
          description: 'Array of line items',
          items: {
            type: 'object',
            properties: {
              price: {
                type: 'string',
                description: 'Price ID',
              },
              quantity: {
                type: 'number',
                description: 'Quantity',
                default: 1,
              },
            },
            required: ['price'],
          },
        },
        mode: {
          type: 'string',
          enum: ['payment', 'subscription', 'setup'],
          description: 'Mode of the checkout session',
          default: 'subscription',
        },
        success_url: {
          type: 'string',
          description: 'URL to redirect after successful payment',
        },
        cancel_url: {
          type: 'string',
          description: 'URL to redirect if payment is cancelled',
        },
      },
      required: ['line_items', 'success_url', 'cancel_url'],
    },
  },
  {
    name: 'list_subscriptions',
    description: 'List all subscriptions',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description:
            'Number of subscriptions to retrieve (default: 10, max: 100)',
          default: 10,
        },
        customer: {
          type: 'string',
          description: 'Filter by customer ID',
        },
        status: {
          type: 'string',
          enum: [
            'active',
            'past_due',
            'unpaid',
            'canceled',
            'incomplete',
            'incomplete_expired',
            'trialing',
          ],
          description: 'Filter by status',
        },
      },
    },
  },
  {
    name: 'cancel_subscription',
    description: 'Cancel a subscription',
    inputSchema: {
      type: 'object',
      properties: {
        subscription_id: {
          type: 'string',
          description: 'Subscription ID (sub_xxx)',
        },
        prorate: {
          type: 'boolean',
          description: 'Whether to prorate the cancellation',
          default: false,
        },
      },
      required: ['subscription_id'],
    },
  },
  {
    name: 'list_invoices',
    description: 'List all invoices',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of invoices to retrieve (default: 10, max: 100)',
          default: 10,
        },
        customer: {
          type: 'string',
          description: 'Filter by customer ID',
        },
        status: {
          type: 'string',
          enum: ['draft', 'open', 'paid', 'uncollectible', 'void'],
          description: 'Filter by status',
        },
      },
    },
  },
  {
    name: 'get_payment_intent',
    description: 'Retrieve a payment intent by ID',
    inputSchema: {
      type: 'object',
      properties: {
        payment_intent_id: {
          type: 'string',
          description: 'Payment Intent ID (pi_xxx)',
        },
      },
      required: ['payment_intent_id'],
    },
  },
];

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async request => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_products': {
        const { limit = 10, active } = args as any;
        const params: Stripe.ProductListParams = { limit };
        if (active !== undefined) params.active = active;

        const products = await stripe.products.list(params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(products.data, null, 2),
            },
          ],
        };
      }

      case 'create_product': {
        const { name, description, active = true } = args as any;
        const product = await stripe.products.create({
          name,
          description,
          active,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(product, null, 2),
            },
          ],
        };
      }

      case 'list_prices': {
        const { limit = 10, product, active } = args as any;
        const params: Stripe.PriceListParams = { limit };
        if (product) params.product = product;
        if (active !== undefined) params.active = active;

        const prices = await stripe.prices.list(params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(prices.data, null, 2),
            },
          ],
        };
      }

      case 'create_price': {
        const {
          product,
          unit_amount,
          currency = 'usd',
          recurring,
        } = args as any;
        const priceData: Stripe.PriceCreateParams = {
          product,
          unit_amount,
          currency,
        };
        if (recurring) {
          priceData.recurring = recurring;
        }

        const price = await stripe.prices.create(priceData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(price, null, 2),
            },
          ],
        };
      }

      case 'create_payment_link': {
        const { line_items } = args as any;
        const paymentLink = await stripe.paymentLinks.create({
          line_items,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(paymentLink, null, 2),
            },
          ],
        };
      }

      case 'list_payment_links': {
        const { limit = 10, active } = args as any;
        const params: Stripe.PaymentLinkListParams = { limit };
        if (active !== undefined) params.active = active;

        const links = await stripe.paymentLinks.list(params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(links.data, null, 2),
            },
          ],
        };
      }

      case 'get_customer': {
        const { customer_id, email } = args as any;

        if (customer_id) {
          const customer = await stripe.customers.retrieve(customer_id);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(customer, null, 2),
              },
            ],
          };
        } else if (email) {
          const customers = await stripe.customers.list({ email, limit: 1 });
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(customers.data[0] || null, null, 2),
              },
            ],
          };
        } else {
          throw new Error('Either customer_id or email is required');
        }
      }

      case 'list_customers': {
        const { limit = 10, email } = args as any;
        const params: Stripe.CustomerListParams = { limit };
        if (email) params.email = email;

        const customers = await stripe.customers.list(params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(customers.data, null, 2),
            },
          ],
        };
      }

      case 'create_checkout_session': {
        const {
          line_items,
          mode = 'subscription',
          success_url,
          cancel_url,
        } = args as any;
        const session = await stripe.checkout.sessions.create({
          line_items,
          mode,
          success_url,
          cancel_url,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(session, null, 2),
            },
          ],
        };
      }

      case 'list_subscriptions': {
        const { limit = 10, customer, status } = args as any;
        const params: Stripe.SubscriptionListParams = { limit };
        if (customer) params.customer = customer;
        if (status) params.status = status;

        const subscriptions = await stripe.subscriptions.list(params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(subscriptions.data, null, 2),
            },
          ],
        };
      }

      case 'cancel_subscription': {
        const { subscription_id, prorate = false } = args as any;
        const subscription = await stripe.subscriptions.cancel(
          subscription_id,
          {
            prorate,
          }
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(subscription, null, 2),
            },
          ],
        };
      }

      case 'list_invoices': {
        const { limit = 10, customer, status } = args as any;
        const params: Stripe.InvoiceListParams = { limit };
        if (customer) params.customer = customer;
        if (status) params.status = status;

        const invoices = await stripe.invoices.list(params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(invoices.data, null, 2),
            },
          ],
        };
      }

      case 'get_payment_intent': {
        const { payment_intent_id } = args as any;
        const paymentIntent =
          await stripe.paymentIntents.retrieve(payment_intent_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(paymentIntent, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}\n${error.stack || ''}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Stripe MCP Server running on stdio');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
