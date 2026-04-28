export type BoardEventType =
  | "card-moved"
  | "card-created"
  | "card-updated"
  | "card-deleted";

export interface CardMovedEvent {
  type: "card-moved";
  boardId: string;
  cardId: string;
  fromColumnId: string;
  toColumnId: string;
  newOrder: number;
  userId: string;
  timestamp: number;
}

export interface CardCreatedEvent {
  type: "card-created";
  boardId: string;
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
    order: number;
  };
  userId: string;
  timestamp: number;
}

export interface CardUpdatedEvent {
  type: "card-updated";
  boardId: string;
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
    order: number;
  };
  userId: string;
  timestamp: number;
}

export interface CardDeletedEvent {
  type: "card-deleted";
  boardId: string;
  cardId: string;
  columnId: string;
  userId: string;
  timestamp: number;
}

export type BoardRealtimeEvent =
  | CardMovedEvent
  | CardCreatedEvent
  | CardUpdatedEvent
  | CardDeletedEvent;

export interface PresenceUser {
  userId: string;
  fullName: string | null;
  email: string;
  onlineAt: string;
}
