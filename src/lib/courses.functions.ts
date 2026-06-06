import { createServerFn } from "@tanstack/react-start";
import { supabase, type Course } from "@/integrations/supabase/client";

export const fetchCourses = createServerFn({ method: "GET" }).handler(
  async (): Promise<Course[]> => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("enrolled_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as Course[];
  },
);
