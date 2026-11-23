import { createBrowserClient } from "@supabase/ssr";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;


export const supabase = createBrowserClient(
  // @ts-ignore
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);


// Take a given Date and turn it into a local time string
// for the datetime-local input.
export const toDateTimeLocal = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  // All of these accessors are in local time, so we can
  // simply pad them out and concat them together with the
  // required seperators as per the standard.
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are 0-indexed
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
