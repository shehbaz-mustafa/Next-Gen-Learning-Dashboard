import { createClient } from "@supabase/supabase-js";

// Publishable (anon) credentials — safe to ship to the client.
const SUPABASE_URL = "https://vyptgguuldsshjtmgasd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_6EEQb5hU_YuTjtKeJHHo9A_3qmtMY0I";

const url =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof process !== "undefined" && process.env?.SUPABASE_URL) ||
  import.meta.env.VITE_SUPABASE_URL ||
  SUPABASE_URL;

const key =
  (typeof process !== "undefined" &&
    process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  (typeof process !== "undefined" && process.env?.SUPABASE_PUBLISHABLE_KEY) ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(url, key);

export type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  duration_hours: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  instructor: string;
  thumbnail_color: string;
  enrolled_at: string;
  created_at: string;
};
