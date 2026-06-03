-- Add price column (NULL = free, number = price in cents)
ALTER TABLE wallpapers ADD COLUMN IF NOT EXISTS price INTEGER;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS price INTEGER;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  item_type TEXT NOT NULL,
  item_id INTEGER NOT NULL,
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Download tracking
CREATE TABLE IF NOT EXISTS downloads (
  id SERIAL PRIMARY KEY,
  item_type TEXT NOT NULL,
  item_id INTEGER NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(item_type, item_id)
);
