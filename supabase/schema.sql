-- =============================================
-- SMM Panel Database Schema for Supabase
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- PROFILES (Users)
-- =============================================
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    username VARCHAR(50) UNIQUE,
    phone VARCHAR(20),
    country VARCHAR(2) DEFAULT 'BD',
    language VARCHAR(5) DEFAULT 'en',
    currency VARCHAR(3) DEFAULT 'USD',
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'support', 'manager')),
    referral_code VARCHAR(10) UNIQUE,
    referred_by UUID REFERENCES profiles(id),
    kyc_status VARCHAR(20) DEFAULT 'none' CHECK (kyc_status IN ('none', 'pending', 'approved', 'rejected')),
    two_fa_enabled BOOLEAN DEFAULT FALSE,
    two_fa_secret TEXT,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- WALLETS
-- =============================================
CREATE TABLE wallets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    balance DECIMAL(15,4) DEFAULT 0.0000,
    frozen_balance DECIMAL(15,4) DEFAULT 0.0000,
    total_deposited DECIMAL(15,4) DEFAULT 0.0000,
    total_spent DECIMAL(15,4) DEFAULT 0.0000,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, currency)
);

-- =============================================
-- TRANSACTIONS
-- =============================================
CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    wallet_id UUID REFERENCES wallets(id) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdraw', 'order', 'refund', 'bonus', 'commission')),
    amount DECIMAL(15,4) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    description TEXT,
    reference_id UUID, -- Order ID, Payment ID, etc.
    reference_type VARCHAR(50), -- 'order', 'payment', 'bonus', etc.
    provider_id TEXT, -- Payment provider transaction ID
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CATEGORIES
-- =============================================
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PROVIDERS
-- =============================================
CREATE TABLE providers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    api_url TEXT NOT NULL,
    api_key TEXT NOT NULL,
    priority INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    rate_limit INTEGER DEFAULT 100, -- requests per minute
    timeout_seconds INTEGER DEFAULT 30,
    supported_services TEXT[] DEFAULT '{}',
    balance DECIMAL(15,4) DEFAULT 0.0000,
    currency VARCHAR(3) DEFAULT 'USD',
    last_sync TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SERVICES
-- =============================================
CREATE TABLE services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    provider_id UUID REFERENCES providers(id) NOT NULL,
    category_id UUID REFERENCES categories(id) NOT NULL,
    provider_service_id TEXT NOT NULL, -- ID from provider's API
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_per_1000 DECIMAL(10,4) NOT NULL,
    min_quantity INTEGER NOT NULL DEFAULT 1,
    max_quantity INTEGER NOT NULL DEFAULT 100000,
    average_time VARCHAR(50), -- "0-1 hours", "24-48 hours"
    quality_score DECIMAL(3,2) DEFAULT 5.00, -- 1.00 to 5.00
    has_refill BOOLEAN DEFAULT FALSE,
    has_cancel BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    examples TEXT[],
    restrictions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(provider_id, provider_service_id)
);

-- =============================================
-- ORDERS
-- =============================================
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES services(id) NOT NULL,
    provider_id UUID REFERENCES providers(id) NOT NULL,
    provider_order_id TEXT, -- Order ID from provider's system
    link TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,4) NOT NULL,
    start_count INTEGER DEFAULT 0,
    remains INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'partial', 'processing', 'cancelled', 'refunded')),
    charge DECIMAL(10,4) NOT NULL, -- Amount charged to user
    currency VARCHAR(3) DEFAULT 'USD',
    notes TEXT,
    refill_requested BOOLEAN DEFAULT FALSE,
    cancel_requested BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ORDER UPDATES
-- =============================================
CREATE TABLE order_updates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(20) NOT NULL,
    start_count INTEGER,
    remains INTEGER,
    provider_response JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PAYMENTS
-- =============================================
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    transaction_id UUID REFERENCES transactions(id) NOT NULL,
    provider VARCHAR(50) NOT NULL, -- 'stripe', 'bkash', 'nagad', 'crypto_btc', etc.
    provider_payment_id TEXT, -- Payment ID from provider
    amount DECIMAL(15,4) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    exchange_rate DECIMAL(10,6) DEFAULT 1.0000,
    amount_received DECIMAL(15,4), -- Amount in base currency
    fee DECIMAL(15,4) DEFAULT 0.0000,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'expired')),
    payment_method VARCHAR(50),
    payment_details JSONB DEFAULT '{}',
    expires_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TICKETS
-- =============================================
CREATE TABLE tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    department VARCHAR(50) NOT NULL CHECK (department IN ('orders', 'payments', 'technical', 'general')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'pending', 'resolved', 'closed')),
    assigned_to UUID REFERENCES profiles(id),
    order_id UUID REFERENCES orders(id), -- If ticket is about an order
    last_reply_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TICKET MESSAGES
-- =============================================
CREATE TABLE ticket_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    message TEXT NOT NULL,
    attachments TEXT[],
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- API CLIENTS
-- =============================================
CREATE TABLE api_clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    api_key VARCHAR(64) UNIQUE NOT NULL,
    api_secret VARCHAR(64) NOT NULL,
    allowed_ips TEXT[],
    rate_limit INTEGER DEFAULT 1000, -- requests per hour
    is_active BOOLEAN DEFAULT TRUE,
    last_used TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- API USAGE LOGS
-- =============================================
CREATE TABLE api_usage_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    api_client_id UUID REFERENCES api_clients(id) ON DELETE CASCADE NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    response_status INTEGER,
    response_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- AFFILIATES
-- =============================================
CREATE TABLE affiliates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 5.00, -- 5.00%
    total_referrals INTEGER DEFAULT 0,
    total_earnings DECIMAL(15,4) DEFAULT 0.0000,
    total_withdrawn DECIMAL(15,4) DEFAULT 0.0000,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- =============================================
-- AFFILIATE EARNINGS
-- =============================================
CREATE TABLE affiliate_earnings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE NOT NULL,
    referral_id UUID REFERENCES profiles(id) NOT NULL,
    order_id UUID REFERENCES orders(id) NOT NULL,
    commission_amount DECIMAL(15,4) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SYSTEM SETTINGS
-- =============================================
CREATE TABLE system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- AUDIT LOGS
-- =============================================
CREATE TABLE audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PRESETS
-- =============================================
CREATE TABLE presets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    services JSONB NOT NULL, -- Array of {service_id, quantity, link}
    is_public BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CART ITEMS
-- =============================================
CREATE TABLE cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES services(id) NOT NULL,
    link TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, service_id, link)
);

-- =============================================
-- EXCHANGE RATES (for multi-currency support)
-- =============================================
CREATE TABLE exchange_rates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    from_currency VARCHAR(3) NOT NULL,
    to_currency VARCHAR(3) NOT NULL,
    rate DECIMAL(15,8) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(from_currency, to_currency)
);

-- =============================================
-- INDEXES
-- =============================================

-- Profile indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_referral_code ON profiles(referral_code);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Wallet indexes
CREATE INDEX idx_wallets_user_id ON wallets(user_id);

-- Transaction indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_reference ON transactions(reference_type, reference_id);

-- Service indexes
CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_services_provider_id ON services(provider_id);
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_services_price ON services(price_per_1000);

-- Order indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_service_id ON orders(service_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_provider_order_id ON orders(provider_order_id);

-- Payment indexes
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_provider ON payments(provider);
CREATE INDEX idx_payments_created_at ON payments(created_at);

-- Ticket indexes
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);

-- API client indexes
CREATE INDEX idx_api_clients_user_id ON api_clients(user_id);
CREATE INDEX idx_api_clients_api_key ON api_clients(api_key);

-- =============================================
-- TRIGGERS
-- =============================================

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_clients_updated_at BEFORE UPDATE ON api_clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON affiliates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_affiliate_earnings_updated_at BEFORE UPDATE ON affiliate_earnings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_presets_updated_at BEFORE UPDATE ON presets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate referral code trigger
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referral_code IS NULL THEN
        NEW.referral_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_generate_referral_code 
    BEFORE INSERT ON profiles 
    FOR EACH ROW EXECUTE FUNCTION generate_referral_code();

-- Auto-create wallet trigger
CREATE OR REPLACE FUNCTION create_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO wallets (user_id, currency, balance) 
    VALUES (NEW.id, 'USD', 0.0000);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_create_user_wallet
    AFTER INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION create_user_wallet();

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies (fixed to avoid recursion)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public profiles read" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow profile creation" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Wallets policies
CREATE POLICY "Users can view own wallet" ON wallets FOR SELECT USING (
    user_id = auth.uid()
);
CREATE POLICY "Users can update own wallet" ON wallets FOR UPDATE USING (
    user_id = auth.uid()
);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (
    user_id = auth.uid()
);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (
    user_id = auth.uid()
);

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (
    user_id = auth.uid()
);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (
    user_id = auth.uid()
);
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (
    user_id = auth.uid()
);

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (
    user_id = auth.uid()
);
CREATE POLICY "Users can create payments" ON payments FOR INSERT WITH CHECK (
    user_id = auth.uid()
);

-- Tickets policies
CREATE POLICY "Users can view own tickets" ON tickets FOR SELECT USING (
    user_id = auth.uid()
);
CREATE POLICY "Users can create tickets" ON tickets FOR INSERT WITH CHECK (
    user_id = auth.uid()
);
CREATE POLICY "Users can update own tickets" ON tickets FOR UPDATE USING (
    user_id = auth.uid()
);

-- Public read policies for services and categories
CREATE POLICY "Anyone can view active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active services" ON services FOR SELECT USING (is_active = true);

-- =============================================
-- INSERT INITIAL DATA
-- =============================================

-- System settings
INSERT INTO system_settings (key, value, type, description) VALUES 
('site_name', 'SMM Panel', 'string', 'Site name'),
('site_description', 'Professional SMM Panel for Social Media Marketing', 'string', 'Site description'),
('default_currency', 'USD', 'string', 'Default currency'),
('min_deposit', '5.00', 'number', 'Minimum deposit amount'),
('max_deposit', '10000.00', 'number', 'Maximum deposit amount'),
('deposit_fee_percentage', '2.5', 'number', 'Deposit fee percentage'),
('affiliate_commission_rate', '5.0', 'number', 'Default affiliate commission rate'),
('email_verification_required', 'true', 'boolean', 'Require email verification'),
('maintenance_mode', 'false', 'boolean', 'Maintenance mode status'),
('api_rate_limit', '1000', 'number', 'API rate limit per hour'),
('order_timeout_hours', '72', 'number', 'Order timeout in hours'),
('refund_policy_days', '30', 'number', 'Refund policy period in days');

-- Default categories
INSERT INTO categories (name, slug, description, icon, sort_order) VALUES 
('Instagram', 'instagram', 'Instagram followers, likes, views and more', '📷', 1),
('Facebook', 'facebook', 'Facebook likes, followers, shares and more', '👥', 2),
('YouTube', 'youtube', 'YouTube views, likes, subscribers and more', '▶️', 3),
('TikTok', 'tiktok', 'TikTok followers, likes, views and more', '🎵', 4),
('Twitter', 'twitter', 'Twitter followers, likes, retweets and more', '🐦', 5),
('Telegram', 'telegram', 'Telegram members, views and more', '✈️', 6),
('LinkedIn', 'linkedin', 'LinkedIn followers, likes, connections and more', '💼', 7),
('Spotify', 'spotify', 'Spotify followers, plays and more', '🎧', 8),
('Website Traffic', 'website-traffic', 'Website visitors, SEO and more', '🌐', 9),
('Other', 'other', 'Other social media services', '📱', 10);

-- Exchange rates (example)
INSERT INTO exchange_rates (from_currency, to_currency, rate) VALUES 
('USD', 'BDT', 110.0000),
('BDT', 'USD', 0.0091),
('USD', 'EUR', 0.8500),
('EUR', 'USD', 1.1765);