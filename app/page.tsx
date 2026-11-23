import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Optional } from "@/lib/types";
import { ConsultationPage } from "./consultation/page";
import { AdminPage } from "./admin/page";

let userDetails = async (): Promise<Optional<any>> => {
  let supabase = await createClient();
  let { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return null;
  }
  return data.claims
}

let userRole = async (id:string): Promise<Optional<string>> => {
  let supabase = await createClient();
  let { data } = await supabase.from("app_role").select("*").eq("id", id);
  if (data && data?.length > 0) {
    return data[0].role
  }
  return null
}

let roleSwitch = (role:Optional<string>) => {
  switch(role) {
    case "user": return <ConsultationPage />
    case "admin": return <AdminPage />
    default: return <></>
  }
}

export default async function Home() {
  let user = await userDetails();
  let role = await userRole(user.sub)
  console.log(user)
  console.log(role)
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>Home</Link>
            </div>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <Hero />
          <main className="flex-1 flex flex-col gap-6 px-4">
            { roleSwitch(role) }
          </main>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
