"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTambo, useTamboThreadInput, type TamboThreadMessage } from "@tambo-ai/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, X, Sparkles, Wrench, CheckCircle2, AlertCircle } from "lucide-react";

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

function MarkdownContent({ text }: { text: string }) {
  return (
    <div className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="m-0 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-4 my-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 my-1">{children}</ol>,
          li: ({ children }) => <li className="my-0.5">{children}</li>,
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-xs font-mono">
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-slate-900 text-slate-50 p-3 rounded-lg overflow-x-auto text-xs my-2">
                <code className="font-mono">{children}</code>
              </pre>
            );
          },
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline">
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-muted-foreground/30 pl-3 italic my-2 text-muted-foreground">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-2 border-border" />,
          table: ({ children }) => (
            <div className="overflow-x-auto my-2">
              <table className="text-xs border-collapse w-full">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
          th: ({ children }) => (
            <th className="border border-border px-2 py-1 text-left font-medium">{children}</th>
          ),
          td: ({ children }) => <td className="border border-border px-2 py-1">{children}</td>,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

function ToolCallBadge({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/60 px-2 py-1 rounded-full w-fit">
      <Wrench className="h-3 w-3" />
      <span>Using {name}...</span>
    </div>
  );
}

function ToolResultCard({ result }: { result: Record<string, unknown> }) {
  const hasError = Boolean(result.error);
  const message = (result.message as string) || (result.success ? "Done" : "Failed");
  const candidates = hasError && Array.isArray(result.candidates) ? (result.candidates as string[]) : null;

  return (
    <div
      className={`mt-2 rounded-lg border px-3 py-2 text-xs ${
        hasError
          ? "bg-red-50 border-red-200 text-red-800"
          : "bg-emerald-50 border-emerald-200 text-emerald-800"
      }`}
    >
      <div className="flex items-center gap-1.5">
        {hasError ? <AlertCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
        <span className="font-medium">{message}</span>
      </div>
      {candidates && (
        <div className="mt-1.5 text-[10px] opacity-80">
          Did you mean: {candidates.join(", ")}
        </div>
      )}
    </div>
  );
}

function MessageContent({ message }: { message: TamboThreadMessage }) {
  const isToolCall = message.actionType === "tool_call";
  const isToolResponse = message.actionType === "tool_response";

  const textParts = message.content
    .filter((part) => part.type === "text" && part.text)
    .map((part) => part.text)
    .join("\n\n");

  if (isToolCall) {
    return <ToolCallBadge name={message.content[0]?.text || "tool"} />;
  }

  if (isToolResponse) {
    try {
      const result = JSON.parse(textParts) as Record<string, unknown>;
      return <ToolResultCard result={result} />;
    } catch {
      return <p className="text-xs opacity-70">{textParts}</p>;
    }
  }

  if (!textParts) return null;

  return <MarkdownContent text={textParts} />;
}

export function AIChatSidebar({ boardId, orgSlug, projectId, columns, cards, members }: AIChatSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { thread, startNewThread, generationStatusMessage, isIdle } = useTambo();
  const { value, setValue, submit, isPending, error: submitError } = useTamboThreadInput();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = thread?.messages ?? [];
  const isLoading = !isIdle || isPending;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isLoading) return;
    await submit();
  };

  const handleNewThread = useCallback(async () => {
    if (isResetting) return;
    setIsResetting(true);
    try {
      startNewThread();
    } finally {
      setTimeout(() => setIsResetting(false), 300);
    }
  }, [isResetting, startNewThread]);

  const apiKeyMissing =
    !process.env.NEXT_PUBLIC_TAMBO_API_KEY ||
    process.env.NEXT_PUBLIC_TAMBO_API_KEY === "your_tambo_api_key_here";

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
          <Button variant="ghost" size="sm" onClick={handleNewThread} disabled={isResetting} className="h-8 px-2">
            {isResetting ? "..." : "New"}
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

      {submitError && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-red-800 text-xs">
          <span className="font-semibold">Error:</span> {submitError.message}
        </div>
      )}

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Ask me to manage your tasks!</p>
              <div className="mt-4 space-y-2 text-xs">
                {[
                  "Move 'Fix bug' to Done",
                  "Create a new task: Review PR",
                  "What's overdue?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    className="w-full bg-muted p-2 rounded cursor-pointer hover:bg-muted/80 text-left transition-colors"
                    onClick={() => setValue(suggestion)}
                  >
                    &quot;{suggestion}&quot;
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, idx) => {
            const isUser = message.role === "user";
            const isTool = message.actionType === "tool_call" || message.actionType === "tool_response";

            return (
              <div
                key={message.id ?? idx}
                className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="mt-1 flex-shrink-0">
                    {isTool ? (
                      <Wrench className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Bot className="h-5 w-5 text-primary" />
                    )}
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm ${
                    isUser
                      ? "bg-primary text-primary-foreground"
                      : isTool
                        ? "bg-muted/50 border border-border/50"
                        : "bg-muted"
                  }`}
                >
                  <MessageContent message={message} />
                  {message.renderedComponent && (
                    <div className="mt-2">{message.renderedComponent}</div>
                  )}
                </div>
                {isUser && (
                  <User className="h-5 w-5 mt-1 flex-shrink-0 text-muted-foreground" />
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2">
              <Bot className="h-5 w-5 text-primary mt-1" />
              <div className="bg-muted rounded-xl px-3.5 py-2.5">
                <div className="flex gap-1">
                  <span className="animate-bounce" style={{ animationDelay: "0s" }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</span>
                </div>
                {generationStatusMessage && (
                  <div className="text-[10px] text-muted-foreground mt-1">{generationStatusMessage}</div>
                )}
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
