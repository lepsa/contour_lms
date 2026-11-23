"use client"

import { ConsultationData } from "@/lib/types";
import { Button } from "./ui/button";
import { supabase } from "@/lib/utils";
import { redirect } from "next/navigation";

const ConsultationCardButtons = (props: { id: string }) => {
  const cancelConsultation = async () => {
    let { error } = await supabase.from("consultation").update({ active: false }).eq('id', props.id)
    if (error) {
      alert(JSON.stringify(error))
    } else {
      redirect("/consultation");
    }
  }
  const rescheduleRedirect = () => redirect(`/consultation/${props.id}`)

  const markStatus = async (id: string, status: string): Promise<void> => {
    await supabase.from("consultation").update({ status: status }).eq('id', id)
    redirect("/consultation");
  }
  return (
    <>
      <Button size="sm" className="bg-green-300" variant={"secondary"} onClick={() => markStatus(props.id, "complete")}>Mark Complete</Button>
      <Button size="sm" className="bg-orange-300" variant={"secondary"} onClick={() => markStatus(props.id, "incomplete")}>Mark Incomplete</Button>
      <Button size="sm" onClick={() => rescheduleRedirect()}>Reschedule</Button>
      <Button size="sm" variant="destructive" onClick={cancelConsultation}>Cancel</Button>
    </>
  )
}

export const ConsultationCard = (props: ConsultationData) => {
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
      { props.status == null
        ? <ConsultationCardButtons id={props.id} />
        : <>
            <h3 className="font-semibold">Status</h3>
            <div>{props.status}</div>
        </>
      }
    </div>
  )
}

export const RequestConsultationButton = () => (
  <Button size="lg" onClick={() => redirect("/consultation/new")}>Add Consultation</Button>
);