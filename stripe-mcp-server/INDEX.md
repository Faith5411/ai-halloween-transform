# Stripe MCP Server for Zed - Documentation Index

Welcome to the Stripe MCP Server! This server enables you to interact with Stripe's API directly from Zed editor using natural language.

## 🚀 Quick Links

- **New User?** → Start with [QUICK_START.md](QUICK_START.md)
- **Installing?** → Follow [INSTALL_CHECKLIST.md](INSTALL_CHECKLIST.md)
- **Need Examples?** → See [EXAMPLES.md](EXAMPLES.md)
- **Full Reference?** → Read [README.md](README.md)
- **Just Finished Setup?** → Check [SETUP_COMPLETE.md](SETUP_COMPLETE.md)

## 📖 Documentation Files

### Getting Started
| File | Description | When to Use |
|------|-------------|-------------|
| [QUICK_START.md](QUICK_START.md) | 5-minute setup guide | First time setup |
| [INSTALL_CHECKLIST.md](INSTALL_CHECKLIST.md) | Step-by-step installation checklist | During installation |
| [SETUP_COMPLETE.md](SETUP_COMPLETE.md) | Post-installation summary | After setup is done |

### Reference & Learning
| File | Description | When to Use |
|------|-------------|-------------|
| [README.md](README.md) | Complete API reference | Need detailed docs |
| [EXAMPLES.md](EXAMPLES.md) | Practical usage examples | Learning how to use tools |

### Configuration
| File | Description | When to Use |
|------|-------------|-------------|
| [zed-config-example.json](zed-config-example.json) | Example Zed configuration | Setting up Zed |
| [.env.example](.env.example) | Environment variable template | Configuring environment |

## 🎯 What This MCP Server Does

This server provides **14 powerful tools** for managing your Stripe account:

### 💳 Products & Pricing
- Create and list products
- Create and manage prices
- Support for one-time and recurring billing

### 🔗 Payment Links & Checkout
- Generate payment links instantly
- Create checkout sessions
- Custom success/cancel URLs

### 👥 Customer Management
- Search customers by email or ID
- View customer details
- Track customer subscriptions

### 📊 Subscriptions
- List and filter subscriptions
- Cancel subscriptions
- Monitor subscription status

### 📄 Invoices & Payments
- View invoice history
- Check payment intents
- Track payment status

## 🏃 Quick Start (3 Commands)

```bash
# 1. Install dependencies
npm install

# 2. Build the server
npm run build

# 3. Configure Zed with your Stripe secret key
# Edit ~/.config/zed/settings.json (see QUICK_START.md)
```

Then restart Zed and test:
```
List all my Stripe products
```

## 🔧 For AI Halloween Transform App

This MCP server is perfect for setting up your AI Halloween Transform payment plans:

1. **Create Products** - Basic, Pro, and Magic plans
2. **Set Prices** - $4.99, $9.99, and $19.99 monthly
3. **Generate Links** - Payment links for each tier
4. **Update App** - Copy URLs to `constants-stripe.ts`
5. **Go Live** - Switch to live keys when ready

See [EXAMPLES.md](EXAMPLES.md) for the complete workflow.

## 📋 Choose Your Path

### Path 1: I'm Just Getting Started
1. Read [QUICK_START.md](QUICK_START.md)
2. Follow [INSTALL_CHECKLIST.md](INSTALL_CHECKLIST.md)
3. Test with examples from [EXAMPLES.md](EXAMPLES.md)

### Path 2: I Need to Set Up Payment Plans
1. Skim [QUICK_START.md](QUICK_START.md) for installation
2. Jump to [EXAMPLES.md](EXAMPLES.md) → "Setting Up Payment Plans"
3. Use the prompts to create products, prices, and links

### Path 3: I'm Having Issues
1. Check [INSTALL_CHECKLIST.md](INSTALL_CHECKLIST.md) → "Troubleshooting"
2. Review [QUICK_START.md](QUICK_START.md) → "Common Issues"
3. Verify your configuration matches [zed-config-example.json](zed-config-example.json)

### Path 4: I Want to Explore All Features
1. Read [README.md](README.md) for complete reference
2. Try examples from [EXAMPLES.md](EXAMPLES.md)
3. Experiment with natural language commands in Zed

## 🛠️ Project Structure

```
stripe-mcp-server/
├── src/
│   └── index.ts              # Main server implementation
├── dist/                     # Compiled output (after build)
│   └── index.js              # Entry point
├── node_modules/             # Dependencies
├── package.json              # Package configuration
├── tsconfig.json             # TypeScript configuration
├── .gitignore                # Git ignore rules
├── .env.example              # Environment variable template
├── INDEX.md                  # This file
├── README.md                 # Complete reference
├── QUICK_START.md            # Quick setup guide
├── INSTALL_CHECKLIST.md      # Installation checklist
├── SETUP_COMPLETE.md         # Post-setup summary
├── EXAMPLES.md               # Usage examples
└── zed-config-example.json   # Zed configuration example
```

## 🔑 Key Concepts

### MCP (Model Context Protocol)
A protocol that lets AI assistants access external tools. This server implements MCP to give Zed access to Stripe's API.

### Tools
Functions that Zed can call. Each tool performs a specific Stripe operation (e.g., "create_product", "list_subscriptions").

### Stripe Secret Key
Your private API key (starts with `sk_test_` or `sk_live_`). Never commit this to Git!

### Payment Links
Shareable URLs that take customers directly to Stripe checkout. Perfect for simple integrations.

## 🎓 Learning Path

1. **Day 1**: Install and configure (30 minutes)
   - Follow QUICK_START.md
   - Complete INSTALL_CHECKLIST.md
   - Test basic commands

2. **Day 2**: Set up your products (1 hour)
   - Create products for your app
   - Set pricing
   - Generate payment links
   - Update your app code

3. **Day 3**: Explore advanced features (as needed)
   - Checkout sessions
   - Customer management
   - Subscription handling
   - Invoice tracking

## 🔒 Security Reminders

- ✅ Use `sk_test_...` for development
- ✅ Use `sk_live_...` only for production
- ❌ Never commit secret keys to Git
- ❌ Never share keys publicly
- ✅ Rotate keys regularly
- ✅ Monitor Stripe Dashboard for suspicious activity

## 📞 Support & Resources

### Documentation
- **This Project**: All `.md` files in this directory
- **Stripe API**: https://stripe.com/docs/api
- **MCP Protocol**: https://modelcontextprotocol.io
- **Zed Editor**: https://zed.dev/docs

### Common Questions

**Q: Do I need a Stripe account?**
A: Yes, but it's free to sign up at https://stripe.com

**Q: Can I use this in production?**
A: Yes! Just switch to live keys and test thoroughly first.

**Q: What if I get an error?**
A: Check the troubleshooting sections in INSTALL_CHECKLIST.md and QUICK_START.md

**Q: Can I add more tools?**
A: Yes! Edit `src/index.ts` and rebuild with `npm run build`

**Q: Does this cost money?**
A: The MCP server is free. Stripe charges fees on successful payments (see Stripe pricing).

## 🎉 Ready to Start?

1. **Never used this before?** → [QUICK_START.md](QUICK_START.md)
2. **Ready to install?** → [INSTALL_CHECKLIST.md](INSTALL_CHECKLIST.md)
3. **Already installed?** → [EXAMPLES.md](EXAMPLES.md)
4. **Need help?** → [README.md](README.md)

---

**Built for the AI Halloween Transform app** 🎃

Manage your Stripe account directly from Zed using natural language!