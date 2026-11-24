"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Optional } from "@/lib/types";
import { supabase, toDateTimeLocal } from "@/lib/utils";
import { redirect } from "next/navigation";
import { Suspense, useState } from "react";

const NewConsultationInner = () => {

  let [firstName, setFirstName] = useState<Optional<string>>();
  let [lastName, setLastName] = useState<Optional<string>>();
  let [reason, setReason] = useState<string>();

  const minDate = new Date();
  // The date creation gracefully handles rolling over the end of a month into the next month.
  minDate.setDate(minDate.getDate() + 1);
  const minDateString = toDateTimeLocal(minDate);

  let [scheduled, setScheduled] = useState<string>(minDateString);


  const submitRequest = async () => {
    let { data } = await supabase.auth.getUser();

    let { error } = await supabase.from("consultation").insert(
      {
        user_id: data.user?.id
        , first_name: firstName
        , last_name: lastName
        , reason: reason
        , scheduled: new Date(scheduled)
        , active: true
      }
    );

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
      <Input id="firstName" type="text" placeholder="First Name" onChange={e => setFirstName(e.target.value)}></Input>
      <label htmlFor="lastName" className="font-bold text-2xl">Last Name</label>
      <Input id="lastName" type="text" placeholder="Last Name" onChange={e => setLastName(e.target.value)}></Input>
      <label htmlFor="reason" className="font-bold text-2xl">Reason for Consultation</label>
      <Input id="reason" type="text" placeholder="I need help with my..." required onChange={e => setReason(e.target.value)}></Input>
      <label htmlFor="scheduled" className="font-bold text-2xl">Date</label>
      <Input id="scheduled" type="datetime-local" required min={minDateString} value={scheduled} onChange={e => setScheduled(e.target.value)}></Input>
      <Button className="mt-4" size="sm" onClick={submitRequest}>Submit Consultation Request</Button>
    </div>
  );
}

export const NewConsultation = () => (
  <Suspense>
    <NewConsultationInner />
  </Suspense>
)
export default NewConsultation;