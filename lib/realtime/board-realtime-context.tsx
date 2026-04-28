"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { BoardRealtimeEvent, PresenceUser } from "@/lib/realtime/types";

interface BoardRealtimeContextValue {
  broadcast: (event: BoardRealtimeEvent) => void;
  onlineUsers: PresenceUser[];
  userId: string;
  subscribe: (callback: (event: BoardRealtimeEvent) => void) => () => void;
}

const BoardRealtimeContext = createContext<BoardRealtimeContextValue | null>(
  null,
);

interface BoardRealtimeProviderProps {
  boardId: string;
  userId: string;
  userName: string | null;
  userEmail: string;
  children: React.ReactNode;
}

export function BoardRealtimeProvider({
  boardId,
  userId,
  userName,
  userEmail,
  children,
}: BoardRealtimeProviderProps) {
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const hasSetup = useRef(false);
  const subscribersRef = useRef<Set<(event: BoardRealtimeEvent) => void>>(new Set());

  const subscribe = useCallback((callback: (event: BoardRealtimeEvent) => void) => {
    subscribersRef.current.add(callback);
    return () => {
      subscribersRef.current.delete(callback);
    };
  }, []);

  const broadcast = useCallback((event: BoardRealtimeEvent) => {
    channelRef.current?.send({
      type: "broadcast",
      event: "board-event",
      payload: event,
    });
  }, []);

  useEffect(() => {
    if (hasSetup.current) return;
    hasSetup.current = true;

    const supabase = createClient();

    const channel = supabase.channel(`board:${boardId}`, {
      config: { broadcast: { self: false, ack: false } },
    });

    channel.on("broadcast", { event: "board-event" }, (message) => {
      const event = message.payload as BoardRealtimeEvent;
      subscribersRef.current.forEach((cb) => cb(event));
    });

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState<PresenceUser>();
      const users: PresenceUser[] = Object.values(state).flat();
      setOnlineUsers(users);
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          userId,
          fullName: userName,
          email: userEmail,
          onlineAt: new Date().toISOString(),
        });
      }
    });

    channelRef.current = channel;

    return () => {
      hasSetup.current = false;
      channelRef.current = null;
      channel.untrack();
      channel.unsubscribe();
    };
  }, [boardId, userId, userName, userEmail]);

  const value: BoardRealtimeContextValue = { broadcast, onlineUsers, userId, subscribe };

  return (
    <BoardRealtimeContext.Provider value={value}>
      {children}
    </BoardRealtimeContext.Provider>
  );
}

export function useBoardRealtimeContext(): BoardRealtimeContextValue {
  const context = useContext(BoardRealtimeContext);
  if (!context) {
    throw new Error(
      "useBoardRealtimeContext must be used within a <BoardRealtimeProvider>",
    );
  }
  return context;
}
