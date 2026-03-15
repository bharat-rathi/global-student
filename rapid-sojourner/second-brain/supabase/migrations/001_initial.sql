-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Items: core table
CREATE TABLE items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users NOT NULL,
  url           TEXT NOT NULL,
  title         TEXT,
  description   TEXT,           -- AI-generated 2-sentence summary
  topic         TEXT,           -- AI-detected topic (e.g. "AI & Tech", "Investing")
  tags          TEXT[],         -- AI-suggested tags
  source_type   TEXT,           -- 'article' | 'video' | 'podcast' | 'tweet' | 'unknown'
  domain        TEXT,           -- extracted domain (youtube.com, linkedin.com)
  thumbnail_url TEXT,
  embedding     VECTOR(1536),   -- text-embedding-3-small output
  folder_id     UUID REFERENCES folders(id) ON DELETE SET NULL,
  is_read       BOOLEAN DEFAULT FALSE,
  enriched_at   TIMESTAMPTZ,    -- null = still processing
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Folders: user-created manual collections
CREATE TABLE folders (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users NOT NULL,
  name        TEXT NOT NULL,
  emoji       TEXT,             -- optional icon e.g. "📚"
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: users can only see their own data
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user owns items" ON items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "user owns folders" ON folders FOR ALL USING (auth.uid() = folder_id);
