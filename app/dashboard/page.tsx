import { SignOutButton } from "@/components/sign-out-button";
import { createSupabaseServerClient } from "@/supabase/server"

export default async function DashboardPage() {
  const client = await createSupabaseServerClient();
  const { data } = await client.auth.getUser();


  return <div>
    <p>Dashboard</p>
    <p>{data.user?.email}</p>
    <SignOutButton />
  </div>
}