"use client";

import { Button } from "@/components/ui/button";
import { Optional } from "@/lib/types";
import { supabase } from "@/lib/utils";
import { redirect } from "next/navigation";
import { useState } from "react";

const NewConsultation = () => {

  let [firstName, setFirstName] = useState<Optional<string>>();
  let [lastName, setLastName] = useState<Optional<string>>();
  let [reason, setReason] = useState<String>();
  let [scheduled, setScheduled] = useState<Date>();

  let submitRequest = async () => {
    let { data } = await supabase.auth.getUser();
    
    let { error } = await supabase.from("consultation").insert(
      {
        user_id: data.user?.id
        , first_name: firstName
        , last_name: lastName
        , reason: reason
        , scheduled: scheduled
        , active: true
      }
    );

    // As simple as possible for error handling
    if(error) {
      alert(JSON.stringify(error));
    } else {
      redirect("/consultation");
    }

  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">First Name</h2>
        <input type="text" placeholder="First Name" onChange={e => setFirstName(e.target.value)}></input>
        <h2 className="font-bold text-2xl mb-4">Last Name</h2>
        <input type="text" placeholder="Last Name" onChange={e => setLastName(e.target.value)}></input>
        <h2 className="font-bold text-2xl mb-4">Reason for Consultation</h2>
        <input type="text" placeholder="I need help with my..." required onChange={e => setReason(e.target.value)}></input>
        <h2 className="font-bold text-2xl mb-4">Date</h2>
        <input type="datetime-local" placeholder="I need help with my..." required onChange={e => setScheduled(new Date(e.target.value))}></input>
        <Button size="sm" onClick={submitRequest}>Submit Consultation Request</Button>
        <hr />
      </div>
    </div>
  );
}

export default NewConsultation;