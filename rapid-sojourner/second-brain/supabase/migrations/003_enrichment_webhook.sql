-- Enable the pg_net extension if not already enabled (Supabase uses this for webhooks)
-- CREATE EXTENSION IF NOT EXISTS pg_net;

-- Note: In a managed Supabase project, it's often easier to set up Edge Function Hooks
-- via the Dashboard (Database -> Webhooks). 
-- This migration provides the SQL-equivalent setup.

/*
-- Example of how to manually trigger the edge function via SQL (requires pg_net)
CREATE OR REPLACE FUNCTION public.handle_new_item_enrichment()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM
    net.http_post(
      url := 'https://your-project-ref.supabase.co/functions/v1/enrich-item',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key') -- Use your actual service role key or a secret
      ),
      body := jsonb_build_object('record', row_to_json(NEW))
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_item_created
  AFTER INSERT ON public.items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_item_enrichment();
*/

-- IMPORTANT: 
-- We recommend setting up the "Edge Function Hook" via the Supabase Dashboard:
-- 1. Go to Database -> Webhooks
-- 2. Create a new Webhook: "enrich-item-trigger"
-- 3. Table: items
-- 4. Events: Insert
-- 5. Type: Supabase Edge Function
-- 6. Function: enrich-item
-- 7. Method: POST
