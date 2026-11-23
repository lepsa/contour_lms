import { ConsultationCard } from "@/components/consultations";
import { createClient } from "@/lib/supabase/server";
import { Optional } from "@/lib/types";
import Link from "next/link"

async function userConsultations(): Promise<Optional<any>> {
  let supabase = await createClient();
  const { data, error } = await supabase.from('consultation').select('*').eq("active", true);
  if (error) {
    console.log(error);
    return null;
  } else {
    return data
  }
}

export async function ConsultationPage() {
  let consultations = await userConsultations();
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4"><Link href="/consultation/new">Add Consultation</Link></h2>
        <h2 className="font-bold text-2xl mb-4">Upcoming Consoltations</h2>
        <ul className="list-none">
          {consultations.map((data, index) =>
            <li className="m-[1rem]" key={index}>
              <ConsultationCard {...data} />
            </li>
          )}

        </ul>
      </div>
    </div>
  )
};
export default ConsultationPage;