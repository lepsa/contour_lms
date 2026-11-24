import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { userRole } from "@/lib/data";
import { Optional, Role } from "@/lib/types";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  let role : Optional<Role> = null;
  if(user && user.sub) {
    role = await userRole(user.sub);
  }

  let userClass = "flex items-center gap-4"
  if(role === "admin") {
    userClass += " text-red-600"
  }

  return user ? (
    <div className={userClass}>
      Hey, {user.email}!
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
