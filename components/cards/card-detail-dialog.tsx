"use client";

import { useState, useMemo } from "react";
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
import { updateCard, deleteCard } from "@/app/(dashboard)/actions";
import { useBoardRealtimeContext } from "@/lib/realtime/board-realtime-context";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const cardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().optional(),
  labels: z.string().optional(),
  assigneeId: z.string().optional(),
});

type CardFormData = z.infer<typeof cardSchema>;

interface CardDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: {
    id: string;
    title: string;
    description: string | null;
    priority: string | null;
    dueDate: Date | null;
    labels: string[] | null;
    assigneeId: string | null;
  };
  columnId: string;
  boardId: string;
  orgSlug: string;
  projectId: string;
  members: { userId: string; fullName: string | null; email: string }[];
}

export function CardDetailDialog({
  open,
  onOpenChange,
  card,
  columnId,
  boardId,
  orgSlug,
  projectId,
  members,
}: CardDetailDialogProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const router = useRouter();
  const { broadcast, userId } = useBoardRealtimeContext();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      title: card.title,
      description: card.description || "",
      priority: (card.priority as "low" | "medium" | "high") || "medium",
      dueDate: card.dueDate
        ? new Date(card.dueDate).toISOString().split("T")[0]
        : "",
      labels: card.labels?.join(", ") || "",
      assigneeId: card.assigneeId || "",
    },
  });

  const watchedPriority = watch("priority");
  const watchedAssignee = watch("assigneeId");

  async function onSubmit(data: CardFormData) {
    setLoading(true);
    setError("");
    try {
      const result = await updateCard(card.id, columnId, boardId, orgSlug, projectId, {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate || null,
        labels: data.labels
          ? data.labels.split(",").map((l) => l.trim()).filter(Boolean)
          : [],
        assigneeId: data.assigneeId || null,
      });
      if (result.error) {
        setError(result.error);
      } else {
        onOpenChange(false);
        const assignee = members.find((m) => m.userId === data.assigneeId);
        broadcast({
          type: "card-updated",
          boardId,
          card: {
            id: card.id,
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

  async function handleDelete() {
    setDeleteLoading(true);
    try {
      const result = await deleteCard(card.id, columnId, boardId, orgSlug, projectId);
      if (result.error) {
        alert(result.error);
      } else {
        setDeleteAlertOpen(false);
        onOpenChange(false);
        broadcast({
          type: "card-deleted",
          boardId,
          cardId: card.id,
          columnId,
          userId,
          timestamp: Date.now(),
        });
        router.refresh();
      }
    } catch {
      alert("An unexpected error occurred");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Card Details</DialogTitle>
          <DialogDescription>Edit card information.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
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
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" {...register("dueDate")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="labels">Labels (comma-separated)</Label>
            <Input id="labels" {...register("labels")} placeholder="bug, feature, urgent" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
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

          <DialogFooter className="flex justify-between items-center">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setDeleteAlertOpen(true)}
              disabled={deleteLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Card</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{card.title}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
