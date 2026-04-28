"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CardItem } from "./card-item";

interface SortableCardProps {
  card: {
    id: string;
    title: string;
    description: string | null;
    priority: string | null;
    dueDate: Date | null;
    labels: string[] | null;
    assigneeId: string | null;
    assigneeName: string | null;
    columnId: string;
  };
  onClick: () => void;
}

export function SortableCard({ card, onClick }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "card",
      card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { "aria-describedby": _, ...attributesWithoutDescribedBy } = attributes;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributesWithoutDescribedBy}
      {...listeners}
      className={`${isDragging ? "opacity-50" : ""} cursor-grab active:cursor-grabbing`}
    >
      <CardItem card={card} onClick={onClick} />
    </div>
  );
}
