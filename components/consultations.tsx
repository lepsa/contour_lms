"use client"

import { ConsultationCardParams } from "@/lib/types";
import { Button } from "./ui/button";
import { supabase } from "@/lib/utils";
import { redirect } from "next/navigation";

export const ConsultationCard = (props: ConsultationCardParams) => {
  let cancelConsultation = async () => {
    let { error } = await supabase.from("consultation").update({active: false}).eq('id', props.id)
    if(error) {
      alert(JSON.stringify(error))
    } else {
      redirect("/consultation");
    }
  }

  let rescheduleRedirect = () => redirect(`/consultation/${props.id}`)

  return (
    <div className="grid grid-cols-1 grid-rows-4 gap-4 m-[2rem]">
      <h3 className="font-semibold">Reason</h3>
      <div>{props.reason}</div>
      <h3 className="font-semibold">First Name</h3>
      <div>{props.first_name}</div>
      <h3 className="font-semibold">Last Name</h3>
      <div>{props.last_name}</div>
      <h3 className="font-semibold">Scheduled</h3>
      <div>{props.scheduled}</div>
      <Button size="sm" onClick={() => rescheduleRedirect()}>Reschedule</Button>
      <Button size="sm" variant="destructive" onClick={cancelConsultation}>Cancel</Button>
    </div>
  )
}

