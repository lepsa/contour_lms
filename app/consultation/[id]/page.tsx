"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConsultationData, Optional } from "@/lib/types";
import { supabase } from "@/lib/utils";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";

const UpdateConsultation = () => {
  let { id } = useParams<{ id: string }>();
  console.log(id)
  let [firstName, setFirstName] = useState<Optional<string>>();
  let [lastName, setLastName] = useState<Optional<string>>();
  let [reason, setReason] = useState<string>();
  let [scheduled, setScheduled] = useState<Date>(new Date());

  useEffect(() => {
    supabase.from('consultation').select('*').eq("id", id).then(({ data }) => {
      if (data?.length == 1) {
        let consultation = data[0];
        setFirstName(consultation.first_name);
        setLastName(consultation.last_name);
        setReason(consultation.reason);
        setScheduled(new Date(consultation.scheduled));
      }
    });
    return () => { }
  }, [id])


  let submitRequest = async () => {
    let { error } = await supabase.from("consultation").update(
      {
        first_name: firstName,
        last_name: lastName,
        reason: reason,
        scheduled: scheduled,
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
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex flex-col gap-2 items-start">
        <label htmlFor="firstName" className="font-bold text-2xl">First Name</label>
        <Input id="firstName" type="text" placeholder="First Name" onChange={e => setFirstName(e.target.value)}></Input>
        <label htmlFor="lastName" className="font-bold text-2xl">Last Name</label>
        <Input id="lastName" type="text" placeholder="Last Name" onChange={e => setLastName(e.target.value)}></Input>
        <label htmlFor="reason" className="font-bold text-2xl">Reason for Consultation</label>
        <Input id="reason" type="text" placeholder="I need help with my..." required onChange={e => setReason(e.target.value)}></Input>
        <label htmlFor="scheduled" className="font-bold text-2xl">Date</label>
        <Input id="scheduled" type="datetime-local" required onChange={e => setScheduled(new Date(e.target.value))}></Input>
        <Button size="sm" onClick={submitRequest}>Update Consultation Request</Button>
        <hr />
      </div>
    </div>
  );
}

export default UpdateConsultation;