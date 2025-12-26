import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const checkDatabaseConnection = async () => {
    const results: string[] = [];
    
    const tables = ['profiles', 'questions', 'user_progress', 'user_achievements'];

    for (const table of tables) {
        try {
            const { error } = await supabase.from(table).select('id').limit(1);
            if (error) {
                // accessing 'message' safely
                results.push(`❌ ${table}: ${error.message}`);
            } else {
                results.push(`✅ ${table}: Ready`);
            }
        } catch (e: any) {
             results.push(`❌ ${table}: ${e.message}`);
        }
    }

    return results;
};
