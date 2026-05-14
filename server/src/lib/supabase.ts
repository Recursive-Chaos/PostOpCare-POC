import { createClient } from "@supabase/supabase-js";
import { config } from "../config/index.js";

// client (signIn, OTP, verifyOtp, getUser)
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
);
// server only
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
);
