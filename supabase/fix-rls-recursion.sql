-- Fix RLS infinite recursion by dropping problematic policies
-- Run this in your Supabase SQL Editor

-- Drop problematic admin policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all wallets" ON wallets;
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;
DROP POLICY IF EXISTS "Support can view all tickets" ON tickets;

-- Create safer policies without recursion
-- Profiles policies
CREATE POLICY "Public profiles read" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow profile creation" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Wallets policies
CREATE POLICY "Users can update own wallet" ON wallets FOR UPDATE USING (user_id = auth.uid());

-- Transactions policies  
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (user_id = auth.uid());

-- Orders policies
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (user_id = auth.uid());

-- Payments policies
CREATE POLICY "Users can create payments" ON payments FOR INSERT WITH CHECK (user_id = auth.uid());

-- Tickets policies
CREATE POLICY "Users can update own tickets" ON tickets FOR UPDATE USING (user_id = auth.uid());

-- Note: Admin access will be handled at the application level using service role key
-- This is safer and more performant than RLS recursive queries