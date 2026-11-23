import { ConsultationData, Optional } from "./types";
import { createClient } from "./supabase/server";


export let userConsultations = async (): Promise<Optional<[ConsultationData]>> => {
  let supabase = await createClient();
  const { data, error } = await supabase.from('consultation').select('*').eq("active", true);
  if (error) {
    console.log(error);
    return null;
  } else {
    return (data as [ConsultationData])
  }
}
