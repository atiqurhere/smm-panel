# SMM Panel - Complete Social Media Marketing Platform

A professional SMM (Social Media Marketing) panel built with Next.js, Supabase, and modern web technologies. This platform allows users to purchase social media services like followers, likes, views, and more across multiple platforms including Instagram, YouTube, Facebook, TikTok, and Twitter.

## 🚀 Features

### Customer Features
- **User Authentication**: Email/password signup with email verification
- **Multi-Currency Wallet System**: USD, BDT support with multiple payment methods
- **Service Catalog**: Browse and filter services by platform and category
- **Order Management**: Place orders, track progress, view history
- **Payment Integration**: Stripe (cards), Crypto (USDT, BTC), Bangladesh methods (bKash, Nagad, Rocket)
- **Real-time Updates**: Live order status updates via Supabase Realtime
- **API Access**: RESTful API for resellers and developers
- **Affiliate System**: Earn commissions by referring customers
- **Support System**: Ticket-based customer support

### Admin Features
- **Dashboard**: Comprehensive admin panel with analytics
- **Order Management**: View, manage, and process all orders
- **Service Management**: Add, edit, and manage services and categories
- **Provider Integration**: Connect and manage multiple service providers
- **User Management**: View and manage customer accounts
- **Payment Monitoring**: Track all transactions and deposits
- **Support System**: Handle customer tickets and inquiries

## 🛠 Tech Stack

- **Next.js 14** with TypeScript and App Router
- **Supabase** for database, auth, and real-time features
- **Tailwind CSS** + **shadcn/ui** for modern UI
- **Stripe** for payment processing
- **BullMQ + Redis** for job queues
- **Nodemailer** for email delivery

## ⚡ Quick Start

### 1. Prerequisites
- Node.js 18+ and npm
- Supabase account
- Redis instance (Upstash recommended)
- Stripe account (for payments)

### 2. Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### 3. Environment Setup

Fill in your `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Redis
REDIS_URL=your_redis_url

# Stripe
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 4. Database Setup

1. Create a Supabase project
2. Run the SQL in `supabase/schema.sql` in your Supabase SQL Editor

### 5. Run the Application

```bash
# Development
npm run dev

# Production
npm run build && npm start
```

### 6. Background Workers (Production)

```bash
# Run workers for order processing
node -r ts-node/register src/lib/workers.ts
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repo to Vercel
2. Add environment variables
3. Deploy!

### Self-Hosted
Use PM2 or Docker for production deployment.

## 📊 Key Features

### 💳 Payment Methods
- **Global**: Stripe (cards), Crypto (USDT, BTC)
- **Bangladesh**: bKash, Nagad, Rocket

### 🔧 Provider Integration
- Connect multiple SMM service providers
- Automatic order processing and status updates
- Real-time service synchronization

### 📈 Business Features
- Multi-currency wallets
- Affiliate/referral system
- API for resellers
- Comprehensive analytics
- Ticket support system

## 🔐 Security

- Row Level Security (RLS) with Supabase
- API rate limiting
- Audit logging
- 2FA support
- Encrypted sensitive data

## 📝 API Documentation

The platform includes a full REST API for:
- Service catalog access
- Order management
- Balance and transaction history
- Webhook integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📞 Support

For support or questions:
- Create an issue on GitHub
- Email: support@smmPanel.com

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ using Next.js, Supabase, and modern web technologies.**
