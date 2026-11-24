import { ConsultationData, Optional, Role } from "./types";
import { createClient } from "./supabase/server";

// This function is used by both the user and admin views into the application state.
// Access control is enforced with postgres policies, limiting regular users to only
// viewing records that match their user ID.
export const userConsultations = async (): Promise<[ConsultationData]> => {
  let supabase = await createClient();
  // Get some ordering on these from the database. That way we can show them neatly,
  // consistently, and in a useable order for planning around.
  const { data, error } = await supabase.from('consultation').select('*').order('scheduled', { ascending: true }).eq("active", true);
  if (error) {
    return Promise.reject(error);
  } else {
    return Promise.resolve(data as [ConsultationData]);
  }
}

// Fetch the current user's role. Useful for doing role based functionality switching.
export const userRole = async (id: string): Promise<Optional<Role>> => {
  let supabase = await createClient();
  let { data } = await supabase.from("app_role").select("*").eq("id", id);
  if (data && data?.length > 0) {
    return data[0].role
  }
  return null
}
