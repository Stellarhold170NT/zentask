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
import { useBoardRealtimeContext } from "@/lib/realtime/board-realtime-context";
import type { BoardRealtimeEvent } from "@/lib/realtime/types";

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
  const isDraggingRef = useRef(false);
  const pendingEventsRef = useRef<BoardRealtimeEvent[]>([]);
  const currentOverColumnRef = useRef<string | null>(null);

  const { broadcast, userId, onlineUsers } = useBoardRealtimeContext();

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  useEffect(() => {
    if (isDraggingRef.current) return;
    setCards(initialCards);
  }, [initialCards]);

  const { subscribe } = useBoardRealtimeContext();

  useEffect(() => {
    return subscribe((event) => {
      if (isDraggingRef.current) {
        pendingEventsRef.current.push(event);
        return;
      }
      applyRealtimeEvent(event);
    });
  }, [subscribe]);

  function applyRealtimeEvent(event: BoardRealtimeEvent) {
    console.log("[Realtime] Applying event:", event.type, event);
    switch (event.type) {
      case "card-moved": {
        const isSameColumn = event.fromColumnId === event.toColumnId;
        setCards((prev) => {
          const updated = prev.map((c) =>
            c.id === event.cardId
              ? { ...c, columnId: event.toColumnId }
              : c
          );
          if (isSameColumn) {
            return updated
              .filter((c) => c.columnId === event.toColumnId)
              .map((c, i) => ({ ...c, order: i }));
          }
          const fromCards = updated
            .filter((c) => c.columnId === event.fromColumnId)
            .map((c, i) => ({ ...c, order: i }));
          const toCards = updated
            .filter((c) => c.columnId === event.toColumnId)
            .map((c, i) => ({ ...c, order: i }));
          const others = updated.filter(
            (c) => c.columnId !== event.fromColumnId && c.columnId !== event.toColumnId
          );
          return [...others, ...fromCards, ...toCards];
        });
        break;
      }
      case "card-created":
        setCards((prev) => {
          const newCard = {
            ...event.card,
            dueDate: event.card.dueDate ? new Date(event.card.dueDate) : null,
          };
          const colCards = prev.filter((c) => c.columnId === newCard.columnId);
          if (colCards.length === 0) return [...prev, newCard];
          const insertIdx = prev.indexOf(colCards[colCards.length - 1]) + 1;
          const next = [...prev];
          next.splice(insertIdx, 0, newCard);
          return next;
        });
        break;
      case "card-updated":
        setCards((prev) =>
          prev.map((c) =>
            c.id === event.card.id
              ? {
                  ...c,
                  ...event.card,
                  dueDate: event.card.dueDate
                    ? new Date(event.card.dueDate)
                    : null,
                }
              : c
          )
        );
        break;
      case "card-deleted":
        setCards((prev) => prev.filter((c) => c.id !== event.cardId));
        break;
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    isDraggingRef.current = true;
    currentOverColumnRef.current = null;
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

    currentOverColumnRef.current = targetColumnId;

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
    console.log("[Realtime] handleDragEnd triggered");
    const { active, over } = event;
    setActiveCard(null);

    if (!over) {
      console.log("[Realtime] No drop target, cancelling");
      setCards(snapshotRef.current);
      isDraggingRef.current = false;
      currentOverColumnRef.current = null;
      const pending = pendingEventsRef.current;
      pendingEventsRef.current = [];
      pending.forEach((evt) => applyRealtimeEvent(evt));
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;
    console.log("[Realtime] Drag:", { activeId, overId });

    const currentCards = cardsRef.current;
    const activeCard = currentCards.find((c) => c.id === activeId);
    if (!activeCard) {
      console.log("[Realtime] Active card not found");
      isDraggingRef.current = false;
      currentOverColumnRef.current = null;
      const pending = pendingEventsRef.current;
      pendingEventsRef.current = [];
      pending.forEach((evt) => applyRealtimeEvent(evt));
      return;
    }

    const targetColumnId = currentOverColumnRef.current;
    console.log("[Realtime] Target column from dragOver:", targetColumnId, "Active card column:", activeCard.columnId);

    if (!targetColumnId || activeCard.columnId === targetColumnId) {
      console.log("[Realtime] Same column or no target, skipping server call");
      isDraggingRef.current = false;
      currentOverColumnRef.current = null;
      const pending = pendingEventsRef.current;
      pendingEventsRef.current = [];
      pending.forEach((evt) => applyRealtimeEvent(evt));
      return;
    }

    const targetCards = currentCards.filter((c) => c.columnId === targetColumnId);
    const targetIndex = targetCards.length;
    console.log("[Realtime] Calling moveCard...", { activeId, targetColumnId, targetIndex });

    try {
      const result = await moveCard(activeId, boardId, orgSlug, projectId, targetColumnId, targetIndex);
      console.log("[Realtime] moveCard result:", result);
      if (result.error) {
        console.log("[Realtime] moveCard returned error:", result.error);
        setMoveError(result.error);
        setCards(snapshotRef.current);
      } else {
        console.log("[Realtime] moveCard success, calling broadcast...");
        broadcast({
          type: "card-moved",
          boardId,
          userId,
          timestamp: Date.now(),
          cardId: activeId,
          fromColumnId: activeCard.columnId,
          toColumnId: targetColumnId,
          newOrder: targetIndex,
        });
        console.log("[Realtime] Broadcast called");
      }
    } catch (err) {
      console.log("[Realtime] moveCard threw error:", err);
      setMoveError("Failed to move card");
      setCards(snapshotRef.current);
    } finally {
      isDraggingRef.current = false;
      currentOverColumnRef.current = null;
      const pending = pendingEventsRef.current;
      pendingEventsRef.current = [];
      pending.forEach((evt) => applyRealtimeEvent(evt));
    }
  }, [columns, boardId, orgSlug, projectId, broadcast, userId]);

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
      {onlineUsers.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span>{onlineUsers.length} user{onlineUsers.length > 1 ? "s" : ""} online</span>
        </div>
      )}
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
