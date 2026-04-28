"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Filter } from "lucide-react";

interface BoardColumnsProps {
  orgSlug: string;
  projectId: string;
  boardId: string;
  userRole: string;
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
  userRole,
  onCardClick,
}: {
  column: { id: string; name: string };
  cards: BoardColumnsProps["cards"];
  boardId: string;
  orgSlug: string;
  projectId: string;
  members: BoardColumnsProps["members"];
  userRole: string;
  onCardClick: (card: BoardColumnsProps["cards"][0]) => void;
}) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: { type: "column", column },
  });

  const canManageColumns = userRole === "owner" || userRole === "admin";

  return (
    <div
      ref={setNodeRef}
      className="min-w-[272px] w-[272px] flex-shrink-0 flex flex-col bg-slate-100 dark:bg-slate-900/50 rounded-xl border shadow-sm group"
    >
      <div className="flex flex-row items-center justify-between px-3 py-2.5 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {column.name}
        </h3>
        {canManageColumns && (
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
        )}
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
  userRole,
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

  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [labelFilter, setLabelFilter] = useState<string>("all");

  const { broadcast, userId, onlineUsers } = useBoardRealtimeContext();

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  useEffect(() => {
    if (isDraggingRef.current) return;
    setCards(initialCards);
  }, [initialCards]);

  const allLabels = useMemo(() => {
    const labels = new Set<string>();
    cards.forEach((card) => {
      card.labels?.forEach((label) => labels.add(label));
    });
    return Array.from(labels).sort();
  }, [cards]);

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesSearch =
        !searchQuery ||
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (card.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesPriority = priorityFilter === "all" || card.priority === priorityFilter;
      const matchesAssignee =
        assigneeFilter === "all" ||
        (assigneeFilter === "unassigned" ? !card.assigneeId : card.assigneeId === assigneeFilter);
      const matchesLabel = labelFilter === "all" || card.labels?.includes(labelFilter);
      return matchesSearch && matchesPriority && matchesAssignee && matchesLabel;
    });
  }, [cards, searchQuery, priorityFilter, assigneeFilter, labelFilter]);

  const activeFilterCount = [
    searchQuery,
    priorityFilter !== "all" ? priorityFilter : "",
    assigneeFilter !== "all" ? assigneeFilter : "",
    labelFilter !== "all" ? labelFilter : "",
  ].filter(Boolean).length;

  function clearFilters() {
    setSearchQuery("");
    setPriorityFilter("all");
    setAssigneeFilter("all");
    setLabelFilter("all");
  }

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

    const originalCard = snapshotRef.current.find((c) => c.id === activeId);
    if (!originalCard) {
      console.log("[Realtime] Original card not found in snapshot");
      isDraggingRef.current = false;
      currentOverColumnRef.current = null;
      const pending = pendingEventsRef.current;
      pendingEventsRef.current = [];
      pending.forEach((evt) => applyRealtimeEvent(evt));
      return;
    }

    const targetColumnId = currentOverColumnRef.current;
    console.log("[Realtime] Target column from dragOver:", targetColumnId, "Original card column:", originalCard.columnId);

    if (!targetColumnId || originalCard.columnId === targetColumnId) {
      console.log("[Realtime] Same column or no target, skipping server call");
      isDraggingRef.current = false;
      currentOverColumnRef.current = null;
      const pending = pendingEventsRef.current;
      pendingEventsRef.current = [];
      pending.forEach((evt) => applyRealtimeEvent(evt));
      return;
    }

    const targetCards = cardsRef.current.filter((c) => c.columnId === targetColumnId);
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
          fromColumnId: originalCard.columnId,
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
      <div className="px-4 pb-2 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All assignees</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {members.map((m) => (
              <SelectItem key={m.userId} value={m.userId}>
                {m.fullName || m.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {allLabels.length > 0 && (
          <Select value={labelFilter} onValueChange={setLabelFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Label" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All labels</SelectItem>
              {allLabels.map((label) => (
                <SelectItem key={label} value={label}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 gap-1">
            <X className="h-3.5 w-3.5" />
            Clear
            <Badge variant="secondary" className="ml-0.5 text-[10px] h-5 px-1.5">
              {activeFilterCount}
            </Badge>
          </Button>
        )}
        <div className="ml-auto text-xs text-muted-foreground">
          {filteredCards.length} of {cards.length} cards
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 h-full p-4">
          {columns.map((column) => {
            const columnCards = filteredCards.filter((c) => c.columnId === column.id);

            return (
              <KanbanColumn
                key={column.id}
                column={column}
                cards={columnCards}
                boardId={boardId}
                orgSlug={orgSlug}
                projectId={projectId}
                members={members}
                userRole={userRole}
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
