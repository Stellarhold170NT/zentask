"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCard } from "@/app/(dashboard)/actions";
import { useBoardRealtimeContext } from "@/lib/realtime/board-realtime-context";
import { Plus } from "lucide-react";

const createCardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.string().optional(),
  labels: z.string().optional(),
  assigneeId: z.string().optional(),
});

type CreateCardFormData = z.infer<typeof createCardSchema>;

interface CreateCardDialogProps {
  columnId: string;
  boardId: string;
  orgSlug: string;
  projectId: string;
  members: { userId: string; fullName: string | null; email: string }[];
}

export function CreateCardDialog({
  columnId,
  boardId,
  orgSlug,
  projectId,
  members,
}: CreateCardDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { broadcast, userId } = useBoardRealtimeContext();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateCardFormData>({
    resolver: zodResolver(createCardSchema),
    defaultValues: { priority: "medium" },
  });

  const watchedPriority = watch("priority");
  const watchedAssignee = watch("assigneeId");

  async function onSubmit(data: CreateCardFormData) {
    setLoading(true);
    setError("");
    try {
      const result = await createCard(
        columnId,
        boardId,
        orgSlug,
        projectId,
        data.title,
        data.description,
        data.priority,
        data.dueDate,
        data.labels
          ? data.labels.split(",").map((l) => l.trim()).filter(Boolean)
          : undefined,
        data.assigneeId
      );
      if (result.error) {
        setError(result.error);
      } else if (result.cardId) {
        setOpen(false);
        reset();
        const assignee = members.find((m) => m.userId === data.assigneeId);
        broadcast({
          type: "card-created",
          boardId,
          card: {
            id: result.cardId,
            title: data.title.trim(),
            description: data.description?.trim() || null,
            priority: data.priority,
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
            labels: data.labels
              ? data.labels.split(",").map((l) => l.trim()).filter(Boolean)
              : [],
            assigneeId: data.assigneeId || null,
            assigneeName: assignee?.fullName || null,
            columnId,
            order: 0,
          },
          userId,
          timestamp: Date.now(),
        });
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create Card</DialogTitle>
          <DialogDescription>Add a new card to this column.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="new-title">Title</Label>
            <Input id="new-title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-description">Description</Label>
            <Textarea id="new-description" {...register("description")} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-priority">Priority</Label>
              <Select
                value={watchedPriority}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setValue("priority", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-dueDate">Due Date</Label>
              <Input id="new-dueDate" type="date" {...register("dueDate")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-labels">Labels (comma-separated)</Label>
            <Input id="new-labels" {...register("labels")} placeholder="bug, feature, urgent" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-assignee">Assignee</Label>
            <Select
              value={watchedAssignee || "none"}
              onValueChange={(value) => setValue("assigneeId", value === "none" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Unassigned</SelectItem>
                {members.map((member) => (
                  <SelectItem key={member.userId} value={member.userId}>
                    {member.fullName || member.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Card"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
