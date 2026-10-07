const SUPABASE_URL = "https://scupodkhkjtynlgdnyrz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_PM4UkxC58wGF2baAlGIGsA_uCupV_kO";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

console.log("Kelal Print Supabase initialized");