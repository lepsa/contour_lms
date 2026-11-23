import { RequestConsultationButton, ConsultationCard } from "@/components/consultations";
import { userConsultations } from "@/lib/data";
import Link from "next/link"

export const ConsultationPage = async () => {
  let consultations = await userConsultations();
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex items-center flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Upcoming Consoltations</h2>
        <RequestConsultationButton/>
        <ul className="list-none">
          {(consultations || []).map((data, index) =>
            <li className="m-[1rem]" key={index}>
              <ConsultationCard {...data} />
            </li>
          )}

        </ul>
      </div>
    </div>
  )
};
export default ConsultationPage