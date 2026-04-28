"use client";

import { useState, useRef, useEffect } from "react";
import { useTambo, useTamboThreadInput, type TamboThreadMessage } from "@tambo-ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, X, Sparkles } from "lucide-react";

interface AIChatSidebarProps {
  boardId: string;
  orgSlug: string;
  projectId: string;
  columns: { id: string; name: string }[];
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
  members: { userId: string; fullName: string | null; email: string }[];
}

export function AIChatSidebar({ columns, cards, members }: AIChatSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { thread, streaming, isIdle, startNewThread } = useTambo();
  const { value, setValue, submit } = useTamboThreadInput();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = thread?.messages ?? [];
  const isLoading = streaming || !isIdle;

  const apiKeyMissing =
    !process.env.NEXT_PUBLIC_TAMBO_API_KEY ||
    process.env.NEXT_PUBLIC_TAMBO_API_KEY === "your_tambo_api_key_here";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isLoading) return;
    await submit();
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-20 z-50 shadow-lg"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        AI Assistant
      </Button>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-background border-l shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">AI Assistant</h2>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={startNewThread} className="h-8 px-2">
            New
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {apiKeyMissing && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs">
          AI is unavailable — add your <code className="font-mono bg-amber-100 px-1 rounded">NEXT_PUBLIC_TAMBO_API_KEY</code> to <code className="font-mono bg-amber-100 px-1 rounded">.env.local</code>
        </div>
      )}

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Ask me to manage your tasks!</p>
              <div className="mt-4 space-y-2 text-xs">
                <p
                  className="bg-muted p-2 rounded cursor-pointer hover:bg-muted/80"
                  onClick={() => setValue("Move 'Fix bug' to Done")}
                >
                  &quot;Move &apos;Fix bug&apos; to Done&quot;
                </p>
                <p
                  className="bg-muted p-2 rounded cursor-pointer hover:bg-muted/80"
                  onClick={() => setValue("Create a new task: Review PR")}
                >
                  &quot;Create a new task: Review PR&quot;
                </p>
                <p
                  className="bg-muted p-2 rounded cursor-pointer hover:bg-muted/80"
                  onClick={() => setValue("What's overdue?")}
                >
                  &quot;What&apos;s overdue?&quot;
                </p>
              </div>
            </div>
          )}

          {messages.map((message: TamboThreadMessage, idx) => (
            <div
              key={message.id ?? idx}
              className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <Bot className="h-6 w-6 mt-1 flex-shrink-0 text-primary" />
              )}
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.content.map((part, idx) => {
                  if (part.type === "text") {
                    return <p key={idx}>{part.text}</p>;
                  }
                  return null;
                })}
                {message.renderedComponent && (
                  <div className="mt-2">{message.renderedComponent}</div>
                )}
              </div>
              {message.role === "user" && (
                <User className="h-6 w-6 mt-1 flex-shrink-0 text-muted-foreground" />
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <div className="bg-muted rounded-lg px-3 py-2">
                <div className="flex gap-1">
                  <span className="animate-bounce" style={{ animationDelay: "0s" }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={apiKeyMissing ? "AI unavailable — missing API key" : "Ask AI to manage tasks..."}
            disabled={isLoading || apiKeyMissing}
            className="flex-1"
          />
          <Button type="submit" size="sm" disabled={isLoading || !value.trim() || apiKeyMissing}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
