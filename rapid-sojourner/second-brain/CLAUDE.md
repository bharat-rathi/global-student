# Second Brain — Content Aggregator App

## Product definition
A mobile-first content aggregation app. Users save URLs from any app via the 
native Share sheet. Content is automatically summarized, AI-categorized into 
topics, and searchable by concept. Think "Pocket meets Notion AI."

## Core user journey (never break this flow)
1. User signs up / signs in with Google or email+password
2. User opens any app (LinkedIn, YouTube, Safari, Podcasts, etc.)
3. Taps Share → app appears in share sheet
4. Quick-save bottom sheet appears with title pre-filled
5. User taps Save → item appears in Library instantly
6. AI enriches in background: summary, topic category, embedding
7. Library shows items grouped by AI-detected topic sections
8. User taps item → bottom sheet slides up with summary + "Open original" button
9. User can move items into manual Folders
10. User can search by concept (semantic, not keyword)

## Tech stack
- Mobile: React Native with Expo SDK 51+
- Navigation: Expo Router (file-based routing)
- Backend: Supabase (Postgres + pgvector + Auth + Edge Functions + Realtime)
- AI: OpenAI API (gpt-4o-mini for summaries/topics, text-embedding-3-small for embeddings)
- State: Zustand
- Bottom sheets: @gorhom/bottom-sheet
- Auth: Supabase Auth (Google OAuth + email/password)

## Project file structure
```
/app
  /(auth)
    _layout.tsx
    welcome.tsx
    login.tsx
    signup.tsx
  /(tabs)
    _layout.tsx
    index.tsx
    search.tsx
    folders.tsx
    profile.tsx
  /folder/[id].tsx
  _layout.tsx
/components
  ItemCard.tsx
  ItemSheet.tsx
  QuickSaveSheet.tsx
  TopicSection.tsx
  FolderCard.tsx
/lib
  supabase.ts
  openai.ts
  store.ts
  utils.ts
/supabase
  /functions
    enrich-item/
    search/
  /migrations
    001_initial.sql
```

## Database schema
```sql
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
```

## AI enrichment contract
The enrich-item Edge Function receives:
  { item_id: string, url: string, title: string }
It must update the items row with:
  description, topic, tags, source_type, thumbnail_url, embedding, enriched_at

## State shape (Zustand)
```typescript
interface AppState {
  user: User | null
  items: Item[]
  folders: Folder[]
  isLoading: boolean
  // actions
  setUser: (user: User | null) => void
  setItems: (items: Item[]) => void
  addItem: (item: Item) => void
  updateItem: (id: string, patch: Partial<Item>) => void
  setFolders: (folders: Folder[]) => void
  addFolder: (folder: Folder) => void
}
```

## Critical rules for every AI session
- NEVER call OpenAI from the client. Edge Functions only.
- NEVER build features outside the current phase scope.
- ALWAYS handle three states: loading, error, empty — every screen, every list.
- ALWAYS use expo-secure-store for session persistence, not AsyncStorage.
- The ItemSheet bottom sheet is the ONLY place summaries appear. Not inline cards.
- Share extension must auto-dismiss after successful save (1.5s confirmation).
- Supabase Realtime subscription on items table — update card when enriched_at 
  is populated.
- topic grouping in Library is derived client-side by grouping items[] by topic 
  field. No separate API call needed.

## Environment variables
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
EXPO_PUBLIC_GOOGLE_CLIENT_ID=

## Phase checklist
- [x] Phase 1: Scaffolding, Supabase setup, DB migrations
- [ ] Phase 2: Auth (Google + email/password)
- [ ] Phase 3: Library screen + manual save (no AI yet)
- [ ] Phase 4: Item bottom sheet + Open original
- [ ] Phase 5: Share extension (iOS first, then Android)
- [ ] Phase 6: AI enrichment edge function
- [ ] Phase 7: Semantic search edge function + screen
- [ ] Phase 8: Folders (create, move items)
- [ ] Phase 9: Polish, Realtime, TestFlight
