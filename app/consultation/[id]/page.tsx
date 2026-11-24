"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase, toDateTimeLocal } from "@/lib/utils";
import { redirect, useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const UpdateConsultationInner = () => {
  let { id } = useParams<{ id: string }>();
  let [firstName, setFirstName] = useState<string | undefined>("");
  let [lastName, setLastName] = useState<string | undefined>("");
  let [reason, setReason] = useState<string>("");

  const minDate = new Date();
  // The date creation gracefully handles rolling over the end of a month into the next month.
  minDate.setDate(minDate.getDate() + 1);
  const minDateString = toDateTimeLocal(minDate);

  let [scheduled, setScheduled] = useState<string>(minDateString);


  useEffect(() => {
    supabase.from('consultation').select('*').eq("id", id).then(({ data }) => {
      if (data?.length == 1) {
        let consultation = data[0];
        setFirstName(consultation.first_name);
        setLastName(consultation.last_name);
        setReason(consultation.reason);
        setScheduled(toDateTimeLocal(new Date(consultation.scheduled)));
      }
    });
    return () => { }
  }, [id])


  const submitRequest = async () => {
    let { error } = await supabase.from("consultation").update(
      {
        first_name: firstName,
        last_name: lastName,
        reason: reason,
        scheduled: new Date(scheduled),
      }
    ).eq('id', id);

    // As simple as possible for error handling
    if (error) {
      alert(JSON.stringify(error));
    } else {
      redirect("/consultation");
    }
  }

  return (
    <div className="grid grid-cols-1 grid-rows-4 gap-4 m-[2rem] p-[1rem]">
      <label htmlFor="firstName" className="font-bold text-2xl">First Name</label>
      <Input id="firstName" type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)}></Input>
      <label htmlFor="lastName" className="font-bold text-2xl">Last Name</label>
      <Input id="lastName" type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)}></Input>
      <label htmlFor="reason" className="font-bold text-2xl">Reason for Consultation</label>
      <Input id="reason" type="text" placeholder="I need help with my..." value={reason} required onChange={e => setReason(e.target.value)}></Input>
      <label htmlFor="scheduled" className="font-bold text-2xl">Date</label>
      <Input id="scheduled" type="datetime-local" min={minDateString} required value={scheduled} onChange={e => setScheduled(e.target.value)}></Input>
      <Button size="sm" variant={"destructive"} onClick={submitRequest}>Update Consultation Request</Button>
    </div>
  );
}

const UpdateConsultation = () => (
  <Suspense>
    <UpdateConsultationInner />
  </Suspense>
)

export default UpdateConsultation;