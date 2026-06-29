import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://pkddavjuaaakmskaayko.supabase.co";
const supabaseAnonKey = "sb_publishable_aSZBy9F_iao0xqd7fXlBgQ_0Uque0Mw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);