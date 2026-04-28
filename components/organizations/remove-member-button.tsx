"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { removeMember } from "@/app/(dashboard)/actions";

interface RemoveMemberButtonProps {
  orgSlug: string;
  userId: string;
  isSelf: boolean;
  isLastOwner: boolean;
}

export function RemoveMemberButton({ orgSlug, userId, isSelf, isLastOwner }: RemoveMemberButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRemove() {
    if (isLastOwner) return;
    if (!confirm(isSelf ? "Leave this organization?" : "Remove this member?")) return;

    setLoading(true);
    try {
      const result = await removeMember(orgSlug, userId);
      if (result.error) {
        alert(result.error);
      } else {
        router.refresh();
      }
    } catch {
      alert("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (isLastOwner) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleRemove}
      disabled={loading}
      className="text-destructive hover:text-destructive"
    >
      <X className="h-4 w-4" />
    </Button>
  );
}
