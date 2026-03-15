-- Function to perform vector similarity search
CREATE OR REPLACE FUNCTION match_items (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  url TEXT,
  title TEXT,
  description TEXT,
  topic TEXT,
  tags TEXT[],
  source_type TEXT,
  domain TEXT,
  thumbnail_url TEXT,
  user_note TEXT,
  is_read BOOLEAN,
  enriched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    items.id,
    items.user_id,
    items.url,
    items.title,
    items.description,
    items.topic,
    items.tags,
    items.source_type,
    items.domain,
    items.thumbnail_url,
    items.user_note,
    items.is_read,
    items.enriched_at,
    items.created_at,
    1 - (items.embedding <=> query_embedding) AS similarity
  FROM items
  WHERE 1 - (items.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
