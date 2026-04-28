"use client";

import { useState } from "react";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getVaultVersions } from "@/app/(dashboard)/actions";

interface VaultVersionHistoryProps {
  entryId: string;
  orgSlug: string;
  entryKey: string;
}

interface Version {
  id: string;
  value: string;
  changedBy: string;
  createdAt: Date | string | null;
}

export function VaultVersionHistory({ entryId, orgSlug, entryKey }: VaultVersionHistoryProps) {
  const [open, setOpen] = useState(false);
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadVersions() {
    setLoading(true);
    setError("");
    const result = await getVaultVersions(entryId, orgSlug);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setVersions(result.versions || []);
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      setOpen(open);
      if (open) loadVersions();
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <History className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
          <DialogDescription>
            Previous values for <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">{entryKey}</code>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4 max-h-[300px] overflow-y-auto">
          {loading && (
            <p className="text-sm text-muted-foreground text-center">Loading...</p>
          )}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {!loading && !error && versions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">No version history found.</p>
          )}
          {!loading && versions.map((version, idx) => (
            <div
              key={version.id}
              className="flex items-start justify-between gap-3 p-3 rounded-lg border bg-muted/30"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono truncate">{version.value}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  by {version.changedBy}
                </p>
              </div>
              <div className="text-right shrink-0">
                <Badge variant="secondary" className="text-[10px]">
                  v{versions.length - idx}
                </Badge>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {version.createdAt
                    ? new Date(version.createdAt).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
