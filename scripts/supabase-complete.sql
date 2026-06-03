-- ============================================================
-- 1. Business tables & columns
-- ============================================================

ALTER TABLE wallpapers ADD COLUMN IF NOT EXISTS price INTEGER;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS price INTEGER;

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

CREATE TABLE IF NOT EXISTS downloads (
  id SERIAL PRIMARY KEY,
  item_type TEXT NOT NULL,
  item_id INTEGER NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(item_type, item_id)
);

-- ============================================================
-- 2. Sample data
-- ============================================================

-- Blog posts (skip if already exist)
INSERT INTO blog_posts (title, slug, excerpt, content, image_url, author, published_at)
SELECT * FROM (VALUES
  (
    'Ergonomic Essentials: Comfort Meets Productivity',
    'ergonomic-essentials-comfort-meets-productivity',
    'Discover how the right setup can transform your productivity and comfort throughout the day.',
    'Ergonomics is more than just a buzzword. It''s the science of designing your workspace to fit your needs, reducing strain and boosting efficiency.

Start with your chair. Your feet should rest flat on the floor, knees at a 90-degree angle, and lower back supported. Next, position your monitor at arm''s length, top of the screen at or slightly below eye level.

Your keyboard and mouse should be close enough that your elbows stay at a comfortable 90-degree angle. Consider a wrist rest if you experience discomfort during long typing sessions.

Small adjustments lead to big improvements. Take breaks every hour, stretch, and listen to your body.',
    'https://framerusercontent.com/images/dVyW0kMnnDotk1u5hwmW8b7Rqo.png',
    'Askalm',
    '2026-02-02'
  ),
  (
    '5 Color Palettes for Your Workspace',
    '5-color-palettes-for-your-workspace',
    'Transform your desk with these carefully curated color schemes.',
    'Color has a profound effect on mood and productivity. Here are five palettes that can transform your workspace:

1. Monochrome Minimal – Whites, grays, and black accents for a clean, focused environment.

2. Earth Tones – Warm browns, greens, and terracotta for a grounding, calming atmosphere.

3. Ocean Blue – Various shades of blue with white accents, proven to boost productivity.

4. Warm Neutrals – Beige, cream, and soft brown for a cozy yet professional look.

5. Accent Pop – Neutral base with a single vibrant color (like yellow or coral) for energy.

Whichever you choose, consistency is key. Stick to 2-3 main colors and use accents sparingly.',
    'https://framerusercontent.com/images/CjRZ7Bi4Hwr2Tgg9Vyp3aaQQGA.png',
    'Askalm',
    '2026-01-12'
  ),
  (
    'Optimizing Wall Space Around Your Desk',
    'optimizing-wall-space-around-your-desk',
    'Make the most of vertical space with these practical tips.',
    'Your desk might be limited, but your walls offer untapped potential.

Shelving is the obvious starting point. Floating shelves keep items accessible without taking up desk space. Use them for plants, books, or decorative pieces that inspire you.

Pegboards are incredibly versatile. They can hold everything from stationery to headphones, and they''re easy to reconfigure as your needs change.

Consider a magnetic board for notes and inspiration. It keeps important items visible without cluttering your desk surface.

Don''t forget about cable management. Route cables along the wall or under your desk to maintain a clean visual line.',
    'https://framerusercontent.com/images/hcUrluPToM9nbVrcIY7yVNNFDk.png',
    'Askalm',
    '2026-01-05'
  )
) AS v
WHERE NOT EXISTS (SELECT 1 FROM blog_posts LIMIT 1);

-- Wallpapers (some free, some premium)
INSERT INTO wallpapers (title, slug, category, image_url, download_url, price)
SELECT * FROM (VALUES
  ('Minimal Dawn', 'minimal-dawn', 'Minimalist', 'https://framerusercontent.com/images/edkUWDLREszDiq4vgt975wDDFM.jpg', '/downloads/minimal-dawn.jpg', NULL),
  ('Serene Landscape', 'serene-landscape', 'Nature', 'https://framerusercontent.com/images/edkUWDLREszDiq4vgt975wDDFM.jpg', '/downloads/serene-landscape.jpg', NULL),
  ('Abstract Flow', 'abstract-flow', 'Abstract', 'https://framerusercontent.com/images/edkUWDLREszDiq4vgt975wDDFM.jpg', '/downloads/abstract-flow.jpg', NULL),
  ('Premium Mountains', 'premium-mountains', 'Nature', 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=400&fit=crop', '/downloads/premium-mountains.jpg', 499),
  ('Dark Ocean', 'dark-ocean', 'Dark', 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=400&fit=crop', '/downloads/dark-ocean.jpg', 299)
) AS v
WHERE NOT EXISTS (SELECT 1 FROM wallpapers LIMIT 1);

-- Templates (some free, some premium)
INSERT INTO templates (title, slug, category, image_url, download_url, price)
SELECT * FROM (VALUES
  ('Clean Resume', 'clean-resume', 'Documents', 'https://framerusercontent.com/images/KkKh1T6zK6twdxDPmlYsFJTj6lg.jpg', '/downloads/clean-resume.pdf', NULL),
  ('Project Planner', 'project-planner', 'Productivity', 'https://framerusercontent.com/images/KkKh1T6zK6twdxDPmlYsFJTj6lg.jpg', '/downloads/project-planner.pdf', 999),
  ('Meeting Notes', 'meeting-notes', 'Productivity', 'https://framerusercontent.com/images/KkKh1T6zK6twdxDPmlYsFJTj6lg.jpg', '/downloads/meeting-notes.pdf', NULL),
  ('Weekly Dashboard', 'weekly-dashboard', 'Notion', 'https://images.unsplash.com/photo-1484788984921-03950022c38b?w=600&h=400&fit=crop', '/downloads/weekly-dashboard.pdf', 1499)
) AS v
WHERE NOT EXISTS (SELECT 1 FROM templates LIMIT 1);

-- Guides
INSERT INTO guides (title, slug, description, image_url, content)
SELECT * FROM (VALUES
  (
    'Setting Up Your Dream Workspace',
    'setting-up-dream-workspace',
    'A step-by-step guide to creating the perfect desk setup.',
    'https://framerusercontent.com/images/DTNpaBh0Djuey5Ql5HpaJWi3lWg.jpg',
    'Step 1: Choose the right desk height.

Your desk should be at elbow height when sitting. Your feet should rest flat on the floor.

Step 2: Lighting matters.

Position your desk perpendicular to windows to avoid glare. Use a task light for focused work.

Step 3: Cable management.

Hide cables with raceways or cable sleeves. Label each cable for easy identification.

Step 4: Personal touches.

Add plants, art, or photos that inspire you. Keep it minimal to avoid clutter.'
  ),
  (
    'Digital Declutter 101',
    'digital-declutter-101',
    'Clean up your digital life with these actionable steps.',
    'https://framerusercontent.com/images/DTNpaBh0Djuey5Ql5HpaJWi3lWg.jpg',
    'Start by organizing your files into a clear folder structure: Work, Personal, Projects.

Delete or archive files older than 6 months that you haven''t touched.

Clean up your desktop — keep only active projects visible.

Unsubscribe from newsletters you never read.

Review your apps and remove what you haven''t used in the last month.

Set up a simple naming convention for files: YYYY-MM-DD-Project-Name.'
  )
) AS v
WHERE NOT EXISTS (SELECT 1 FROM guides LIMIT 1);
