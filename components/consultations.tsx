"use client"

import { ConsultationData, Optional } from "@/lib/types";
import { Button } from "./ui/button";
import { supabase } from "@/lib/utils";
import { redirect } from "next/navigation";

export const ConsultationCard = (props: ConsultationData) => {
  let cancelConsultation = async () => {
    let { error } = await supabase.from("consultation").update({ active: false }).eq('id', props.id)
    if (error) {
      alert(JSON.stringify(error))
    } else {
      redirect("/consultation");
    }
  }

  let rescheduleRedirect = () => redirect(`/consultation/${props.id}`)
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="grid grid-cols-1 grid-rows-4 gap-4 m-[2rem] p-[1rem] border-solid border-4">
      <h3 className="font-semibold">Reason</h3>
      <div>{props.reason}</div>
      <h3 className="font-semibold">First Name</h3>
      <div>{props.first_name}</div>
      <h3 className="font-semibold">Last Name</h3>
      <div>{props.last_name}</div>
      <h3 className="font-semibold">Scheduled</h3>
      <div>{

        new Intl.DateTimeFormat("en-AU", {
          dateStyle: "full",
          timeStyle: "long",
          timeZone: timezone,
        }).format(new Date(props.scheduled))
      }</div>
      <Button size="sm" onClick={() => rescheduleRedirect()}>Reschedule</Button>
      <Button size="sm" variant="destructive" onClick={cancelConsultation}>Cancel</Button>
    </div>
  )
}

export const RequestConsultationButton = () => (
  <Button size="lg" onClick={() => redirect("/consultation/new")}>Add Consultation</Button>
);