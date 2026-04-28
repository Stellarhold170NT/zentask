"use client";

import { useTransition } from "react";
import { logout } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => logout())}
    >
      {isPending ? "Logging out..." : "Log out"}
    </Button>
  );
}
