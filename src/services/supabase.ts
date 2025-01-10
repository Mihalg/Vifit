import { createClient } from "@supabase/supabase-js";
import { Database } from "../../database.types";
const supabaseUrl = "https://qbabzpjyexwljwjgirjp.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;
