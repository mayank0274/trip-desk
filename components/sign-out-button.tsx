"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <Button
      onClick={handleSignOut}
      variant="outline"
      className="border-sand text-ink hover:bg-muted cursor-pointer"
    >
      Sign Out
    </Button>
  );
}
