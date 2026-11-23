import { ConsultationData, Optional } from "./types";
import { createClient } from "./supabase/server";

// This function is used by both the user and admin views into the application state.
// Access control is enforced with postgres policies, limiting regular users to only
// viewing records that match their user ID.
export const userConsultations = async (): Promise<Optional<[ConsultationData]>> => {
  let supabase = await createClient();
  const { data, error } = await supabase.from('consultation').select('*').order('scheduled', { ascending: true }).eq("active", true);
  if (error) {
    alert(JSON.stringify(error));
    return null
  } else {
    return (data as [ConsultationData])
  }
}

export const userRole = async (id: string): Promise<Optional<string>> => {
  let supabase = await createClient();
  let { data } = await supabase.from("app_role").select("*").eq("id", id);
  if (data && data?.length > 0) {
    return data[0].role
  }
  return null
}