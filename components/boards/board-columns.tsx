"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpdateColumnDialog } from "@/components/boards/update-column-dialog";
import { DeleteColumnAlertDialog } from "@/components/boards/delete-column-alert-dialog";
import { CreateCardDialog } from "@/components/cards/create-card-dialog";
import { SortableCard } from "@/components/cards/sortable-card";
import { CardItem } from "@/components/cards/card-item";
import { CardDetailDialog } from "@/components/cards/card-detail-dialog";
import { moveCard } from "@/app/(dashboard)/actions";
import { useDroppable } from "@dnd-kit/core";

interface BoardColumnsProps {
  orgSlug: string;
  projectId: string;
  boardId: string;
  columns: {
    id: string;
    name: string;
    order: number;
  }[];
  cards: {
    id: string;
    title: string;
    description: string | null;
    priority: string | null;
    dueDate: Date | null;
    labels: string[] | null;
    assigneeId: string | null;
    assigneeName: string | null;
    columnId: string;
  }[];
  members: {
    userId: string;
    fullName: string | null;
    email: string;
  }[];
}

function KanbanColumn({
  column,
  cards,
  boardId,
  orgSlug,
  projectId,
  members,
  onCardClick,
}: {
  column: { id: string; name: string };
  cards: BoardColumnsProps["cards"];
  boardId: string;
  orgSlug: string;
  projectId: string;
  members: BoardColumnsProps["members"];
  onCardClick: (card: BoardColumnsProps["cards"][0]) => void;
}) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: { type: "column", column },
  });

  return (
    <div
      ref={setNodeRef}
      className="min-w-[272px] w-[272px] flex-shrink-0 flex flex-col bg-slate-100 dark:bg-slate-900/50 rounded-xl border shadow-sm"
    >
      <div className="flex flex-row items-center justify-between px-3 py-2.5 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {column.name}
        </h3>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <UpdateColumnDialog
            columnId={column.id}
            boardId={boardId}
            orgSlug={orgSlug}
            projectId={projectId}
            currentName={column.name}
          />
          <DeleteColumnAlertDialog
            columnId={column.id}
            boardId={boardId}
            orgSlug={orgSlug}
            projectId={projectId}
            columnName={column.name}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-0">
        <SortableContext
          items={cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <SortableCard
              key={card.id}
              card={card}
              onClick={() => onCardClick(card)}
            />
          ))}
        </SortableContext>
        <CreateCardDialog
          columnId={column.id}
          boardId={boardId}
          orgSlug={orgSlug}
          projectId={projectId}
          members={members}
        />
      </div>
    </div>
  );
}

export function BoardColumns({
  orgSlug,
  projectId,
  boardId,
  columns,
  cards: initialCards,
  members,
}: BoardColumnsProps) {
  const [cards, setCards] = useState(initialCards);
  const [activeCard, setActiveCard] = useState<typeof cards[0] | null>(null);
  const [selectedCard, setSelectedCard] = useState<typeof cards[0] | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [moveError, setMoveError] = useState("");
  const snapshotRef = useRef<typeof cards>([]);
  const cardsRef = useRef(cards);

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const cardId = event.active.id as string;
    const card = cardsRef.current.find((c) => c.id === cardId);
    if (card) {
      snapshotRef.current = [...cardsRef.current];
      setActiveCard(card);
      setMoveError("");
    }
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeCard = cardsRef.current.find((c) => c.id === activeId);
    if (!activeCard) return;

    const overColumn = columns.find((c) => c.id === overId);
    const overCard = cardsRef.current.find((c) => c.id === overId);

    let targetColumnId: string;

    if (overColumn) {
      targetColumnId = overColumn.id;
    } else if (overCard) {
      targetColumnId = overCard.columnId;
    } else {
      return;
    }

    if (activeCard.columnId === targetColumnId) {
      return;
    }

    setCards((prev) => {
      const activeIndex = prev.findIndex((c) => c.id === activeId);
      if (activeIndex === -1) return prev;

      const newCards = [...prev];
      const [removed] = newCards.splice(activeIndex, 1);
      const updated = { ...removed, columnId: targetColumnId };

      const targetColumnCards = newCards.filter((c) => c.columnId === targetColumnId);
      const insertIndex = targetColumnCards.length > 0
        ? newCards.indexOf(targetColumnCards[targetColumnCards.length - 1]) + 1
        : newCards.length;

      newCards.splice(insertIndex, 0, updated);
      return newCards;
    });
  }, [columns]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) {
      setCards(snapshotRef.current);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const currentCards = cardsRef.current;
    const activeCard = currentCards.find((c) => c.id === activeId);
    if (!activeCard) return;

    const overColumn = columns.find((c) => c.id === overId);
    const overCard = currentCards.find((c) => c.id === overId);

    let targetColumnId: string;
    let targetIndex: number;

    if (overColumn) {
      targetColumnId = overColumn.id;
      const targetCards = currentCards.filter((c) => c.columnId === targetColumnId);
      targetIndex = targetCards.length > 0 ? targetCards.length - 1 : 0;
    } else if (overCard) {
      targetColumnId = overCard.columnId;
      const targetCards = currentCards.filter((c) => c.columnId === targetColumnId);
      targetIndex = targetCards.findIndex((c) => c.id === overId);
      if (targetIndex === -1) targetIndex = targetCards.length;
    } else {
      setCards(snapshotRef.current);
      return;
    }

    if (activeCard.columnId === targetColumnId) {
      return;
    }

    try {
      const result = await moveCard(activeId, boardId, orgSlug, projectId, targetColumnId, targetIndex);
      if (result.error) {
        setMoveError(result.error);
        setCards(snapshotRef.current);
      }
    } catch {
      setMoveError("Failed to move card");
      setCards(snapshotRef.current);
    }
  }, [columns, boardId, orgSlug, projectId]);

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: { opacity: "0.5" },
      },
    }),
  };

  function handleCardClick(card: typeof cards[0]) {
    setSelectedCard(card);
    setDetailOpen(true);
  }

  if (columns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No columns yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Add a column to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {moveError && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md mb-4">
          {moveError}
        </div>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 h-full p-4">
          {columns.map((column) => {
            const columnCards = cards.filter((c) => c.columnId === column.id);

            return (
              <KanbanColumn
                key={column.id}
                column={column}
                cards={columnCards}
                boardId={boardId}
                orgSlug={orgSlug}
                projectId={projectId}
                members={members}
                onCardClick={handleCardClick}
              />
            );
          })}
        </div>

        <DragOverlay dropAnimation={dropAnimation}>
          {activeCard ? (
            <CardItem
              card={activeCard}
              onClick={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {selectedCard && (
        <CardDetailDialog
          open={detailOpen}
          onOpenChange={setDetailOpen}
          card={selectedCard}
          columnId={selectedCard.columnId}
          boardId={boardId}
          orgSlug={orgSlug}
          projectId={projectId}
          members={members}
        />
      )}
    </>
  );
}
