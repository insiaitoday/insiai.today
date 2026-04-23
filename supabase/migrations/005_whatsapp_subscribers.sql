-- ============================================================
-- Migration: Add WhatsApp Subscribers Table
-- Created: 2026-04-11
-- ============================================================

-- WhatsApp subscribers table for collecting phone numbers
CREATE TABLE IF NOT EXISTS whatsapp_subscribers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number  TEXT NOT NULL,
  country_code  TEXT NOT NULL,
  full_number   TEXT UNIQUE NOT NULL, -- E.164 format: +1234567890
  name          TEXT,
  verified      BOOLEAN DEFAULT false,
  verification_code TEXT,
  verification_sent_at TIMESTAMPTZ,
  interests     TEXT[] DEFAULT '{}', -- AI topics they're interested in
  language      TEXT DEFAULT 'en',
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'active', 'unsubscribed')),
  ip_address    TEXT,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_whatsapp_full_number ON whatsapp_subscribers(full_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_status ON whatsapp_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_verified ON whatsapp_subscribers(verified);
CREATE INDEX IF NOT EXISTS idx_whatsapp_created_at ON whatsapp_subscribers(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_whatsapp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER whatsapp_subscribers_updated_at
  BEFORE UPDATE ON whatsapp_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_whatsapp_updated_at();

-- Add comment
COMMENT ON TABLE whatsapp_subscribers IS 'Stores phone numbers for WhatsApp group invitations';
