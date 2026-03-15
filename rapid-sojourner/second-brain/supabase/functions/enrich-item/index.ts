import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log("Enrichment function started");

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    const payload = await req.json()
    console.log("Received payload:", JSON.stringify(payload));
    
    // Supabase webhooks send the new record in 'record'
    const record = payload.record || payload
    const { id, url, title } = record

    if (!url) {
      throw new Error("No URL provided in payload")
    }

    // 1. Fetch content (simple extraction)
    console.log(`Fetching content for: ${url}`);
    let textContent = "";
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(10000) })
      const html = await response.text()
      // Extract main text by removing script/style/tags
      textContent = html
        .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
        .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "")
        .replace(/<[^>]*>?/gm, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 6000) // Keep first 6k chars for GPT context
    } catch (e) {
      console.warn("Could not fetch URL content, falling back to title only:", e.message);
      textContent = "Content could not be fetched.";
    }

    // 2. AI Summarization & Categorization
    console.log("Calling OpenAI for summarization...");
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert content librarian for a "Second Brain" app. 
            Analyze the provided title and text content.
            Return a JSON object with:
            - description: A concise 2-sentence summary that captures the "so what" and core value.
            - topic: A high-level category name (e.g., "AI & Tech", "Investing", "Health", "Productivity").
            - tags: An array of 3-5 specific keywords.
            - source_type: One of [article, video, tweet, podcast, paper, unknown].`
          },
          {
            role: 'user',
            content: `URL: ${url}\nTitle: ${title}\nContent Snippet: ${textContent}`
          }
        ],
        response_format: { type: 'json_object' }
      })
    })
    
    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`OpenAI Chat API failed: ${errorText}`);
    }

    const aiData = await aiResponse.json()
    const enrichment = JSON.parse(aiData.choices[0].message.content)

    // 3. Generate Embedding for semantic search
    console.log("Generating embedding...");
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: `${enrichment.topic}: ${enrichment.description}`
      })
    })

    if (!embeddingResponse.ok) {
        const errorText = await embeddingResponse.text();
        throw new Error(`OpenAI Embedding API failed: ${errorText}`);
    }

    const embeddingData = await embeddingResponse.json()
    const embedding = embeddingData.data[0].embedding

    // 4. Update Database
    console.log("Updating database record...");
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
    const { error: updateError } = await supabase
      .from('items')
      .update({
        description: enrichment.description,
        topic: enrichment.topic,
        tags: enrichment.tags,
        source_type: enrichment.source_type,
        embedding: embedding,
        enriched_at: new Date().toISOString()
      })
      .eq('id', id)

    if (updateError) throw updateError

    console.log("Enrichment complete for ID:", id);
    return new Response(JSON.stringify({ success: true, id }), { 
      headers: { 'Content-Type': 'application/json' } 
    })

  } catch (err) {
    console.error("Function error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    })
  }
})
