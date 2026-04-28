"use client";

import { Calendar, Flag, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface CardItemProps {
  card: {
    id: string;
    title: string;
    description: string | null;
    priority: string | null;
    dueDate: Date | null;
    labels: string[] | null;
    assigneeId: string | null;
    assigneeName?: string | null;
  };
  onClick: () => void;
}

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

const priorityLabels: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const labelColorPalette = [
  "bg-red-100 text-red-800",
  "bg-orange-100 text-orange-800",
  "bg-amber-100 text-amber-800",
  "bg-yellow-100 text-yellow-800",
  "bg-lime-100 text-lime-800",
  "bg-green-100 text-green-800",
  "bg-emerald-100 text-emerald-800",
  "bg-teal-100 text-teal-800",
  "bg-cyan-100 text-cyan-800",
  "bg-sky-100 text-sky-800",
  "bg-blue-100 text-blue-800",
  "bg-indigo-100 text-indigo-800",
  "bg-violet-100 text-violet-800",
  "bg-purple-100 text-purple-800",
  "bg-fuchsia-100 text-fuchsia-800",
  "bg-pink-100 text-pink-800",
  "bg-rose-100 text-rose-800",
];

function getLabelColor(label: string): string {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % labelColorPalette.length;
  return labelColorPalette[index];
}

export function CardItem({ card, onClick }: CardItemProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border-0 shadow-sm bg-white dark:bg-slate-950"
      onClick={onClick}
    >
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start gap-2">
          <div
            className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
            style={{
              backgroundColor:
                card.priority === "high"
                  ? "#ef4444"
                  : card.priority === "medium"
                  ? "#eab308"
                  : "#3b82f6",
            }}
          />
          <p className="text-sm font-medium line-clamp-2 leading-snug">{card.title}</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {card.priority && (
            <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${priorityColors[card.priority] || ""}`}>
              {priorityLabels[card.priority] || card.priority}
            </span>
          )}

          {card.dueDate && (
            <span className="inline-flex items-center text-[10px] text-muted-foreground gap-0.5">
              <Calendar className="h-3 w-3" />
              {new Date(card.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>

        {card.labels && card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.labels.map((label, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${getLabelColor(label)}`}
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {card.assigneeName && (
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <User className="h-3 w-3" />
            {card.assigneeName}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
