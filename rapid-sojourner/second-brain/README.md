# Second Brain 🧠

A premium mobile application for captures, enriching, and organizing your digital life with AI.

## Features

- **Quick Save**: Instantly save URLs from anywhere via our built-in share extension.
- **AI Enrichment**: Automatically generates summaries, extracts topics, and creates tags for every link you save using OpenAI GPT-4o-mini.
- **Semantic Search**: Find your saved items by concept and meaning, not just keywords, powered by pgvector and OpenAI Embeddings.
- **Folders & Organization**: Group your links into custom folders for better focus.
- **Deep Linking**: Seamlessly open specific items from external notifications or links.

## Tech Stack

- **Frontend**: React Native, Expo (SDK 54), Expo Router, Zustand, Bottom Sheet.
- **Backend**: Supabase (Database, Auth, Edge Functions, Realtime, pgvector).
- **AI**: OpenAI API (Completions & Embeddings).

## Setup & Deployment

1.  **Database**: Follow the [Cloud Setup Guide](brain/cloud_setup_guide.md) to configure your Supabase project.
2.  **Environment Variables**: Create a `.env.local` with your Supabase credentials:
    ```
    EXPO_PUBLIC_SUPABASE_URL=your_url
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4.  **Run Development Build**:
    ```bash
    npx expo run:ios
    npx expo run:android
    ```

*Note: Share extension requires a Development Build and physical device for full testing.*
