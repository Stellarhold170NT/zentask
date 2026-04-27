"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { 
  Loader2,
  Move, 
  Search, 
  Sparkles, 
  Split 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CommandPaletteProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  // Manual input management for AI SDK v5+
  const [inputValue, setInputValue] = React.useState("")
  
  const { messages, sendMessage, status, addToolResult, error } = useChat({
    api: '/api/chat',
    maxSteps: 5, // Enable client-side multi-step auto-looping
    body: {
      projectId: "00000000-0000-0000-0000-000000000000"
    },
    onFinish: (message) => {
      console.log("AI FINISHED:", message);
    },
    onError: (err) => {
      console.error("AI ERROR:", err);
    }
  })

  // Log messages changes
  React.useEffect(() => {
    if (messages.length > 0) {
      console.log("CURRENT MESSAGES:", messages);
    }
  }, [messages]);

  const [executingToolId, setExecutingToolId] = React.useState<string | null>(null)

  const handleExecuteTool = async (toolCallId: string, toolName: string, args: any) => {
    setExecutingToolId(toolCallId)
    try {
      const response = await fetch('/api/tools/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName, args })
      })
      const { result, error } = await response.json()
      
      if (error) throw new Error(error)

      // Thông báo cho AI SDK là tool đã chạy xong
      addToolResult({
        toolCallId,
        result: result || { success: true }
      })
    } catch (err) {
      console.error("Failed to execute tool:", err)
      addToolResult({
        toolCallId,
        result: { error: "Failed to execute action" }
      })
    } finally {
      setExecutingToolId(null)
    }
  }

  const isLoading = status === 'streaming' || status === 'submitting'

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, setOpen])

  const handleSend = async () => {
    if (!inputValue.trim()) return
    const message = inputValue
    setInputValue("") // Clear input
    await sendMessage({ text: message })
  }

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <div className="relative">
          <CommandInput 
            value={inputValue}
            onValueChange={setInputValue}
            placeholder="Ask AI to do something... (e.g. 'Move login task to Done')" 
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          {isLoading && (
            <div className="absolute right-3 top-3">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        <CommandList>
          {messages.length > 0 ? (
            <CommandGroup heading="Conversation">
              <div className="space-y-4 py-2">
                {messages.map(m => {
                  console.log(`Rendering message ${m.id} [${m.role}]`, m);
                  return (
                    <div key={m.id} className={cn(
                      "p-3 text-sm rounded-md border shadow-sm",
                      m.role === 'user' 
                        ? "bg-primary/5 border-primary/10 ml-8" 
                        : "bg-muted/30 border-muted-foreground/10 mr-8"
                    )}>
                      <div className="flex items-center gap-2 mb-2 font-medium">
                        {m.role === 'user' ? (
                          <div className="size-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">U</div>
                        ) : (
                          <Sparkles className="h-3.5 w-3.5 text-primary" />
                        )}
                        <span className={m.role === 'user' ? "text-primary/70" : "text-primary font-bold"}>
                          {m.role === 'user' ? "You" : "Zentask AI"}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {/* Robust fallback: Render content if parts are empty or not rendering text */}
                        {m.parts.length === 0 && m.content && (
                          <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{m.content}</p>
                        )}
                        
                        {m.parts.map((part, i) => {
                          console.log(`- Part ${i}:`, part.type);
                          if (part.type === 'text') {
                            return <p key={i} className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{part.text}</p>
                          }
                        
                        if (part.type === 'reasoning') {
                          return (
                            <div key={i} className="text-[11px] text-muted-foreground italic p-2 bg-muted/50 rounded border-l-2 border-primary/20">
                              {part.text}
                            </div>
                          )
                        }

                        if (part.type === 'tool-invocation' || part.type.startsWith('tool-')) {
                          // Handle both standard and dynamic tool part types
                          const toolInvocation = (part as any).toolInvocation || (part as any);
                          const { toolName, toolCallId, state } = toolInvocation;
                          const args = toolInvocation.args;

                          if (!toolCallId) {
                            console.log("Missing toolCallId for part:", part);
                            return null;
                          }

                          return (
                            <div key={toolCallId} className="mt-2 p-3 bg-background/50 rounded-lg border border-primary/20 shadow-inner">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="p-1 bg-primary/10 rounded">
                                  {toolName === 'move_task' ? <Move className="h-3 w-3 text-primary" /> : <Sparkles className="h-3 w-3 text-primary" />}
                                </div>
                                <span className="font-bold text-[10px] uppercase tracking-tighter text-primary/60">
                                  {toolName || part.type.replace('tool-', '')}
                                </span>
                                <div className="ml-auto">
                                  {state === 'result' ? (
                                    <span className="text-[9px] bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded border border-green-500/20">Done</span>
                                  ) : (
                                    <span className="text-[9px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded border border-amber-500/20">Pending</span>
                                  )}
                                </div>
                              </div>

                              {state === 'call' || !state ? (
                                <div className="space-y-3">
                                  <pre className="text-[10px] bg-muted/30 p-2 rounded border font-mono overflow-auto max-h-24">
                                    {JSON.stringify(args, null, 2)}
                                  </pre>
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm" 
                                      className="flex-1 h-7 text-[10px] font-bold shadow-md text-white"
                                      disabled={executingToolId === toolCallId}
                                      onClick={() => handleExecuteTool(toolCallId, toolName || part.type.replace('tool-', ''), args)}
                                    >
                                      {executingToolId === toolCallId ? "Processing..." : "Confirm Action"}
                                    </Button>
                                    <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => setOpen(false)}>Cancel</Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-[10px] text-green-600 font-medium">
                                  Action executed successfully.
                                </div>
                              )}
                            </div>
                          );
                        }

                        // Ignore technical parts
                        if (part.type === 'step-start' || part.type.startsWith('tool-')) return null;

                        // Debug fallback for other unknown types
                        return (
                          <div key={i} className="text-[10px] text-muted-foreground border border-dashed p-1 opacity-50 mt-2">
                            Unrecognized part: {part.type}
                            <pre className="mt-1 overflow-auto max-h-20">{JSON.stringify(part, null, 1)}</pre>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )})}

                {isLoading && (
                  <div className="flex items-center gap-2 p-3 text-xs text-muted-foreground animate-pulse ml-8">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>AI is thinking...</span>
                  </div>
                )}

                {error && (
                  <div className="p-3 mx-8 text-xs bg-red-500/10 border border-red-500/20 text-red-500 rounded-md">
                    <p className="font-bold mb-1">Error:</p>
                    <p>{error.message}</p>
                  </div>
                )}
              </div>
            </CommandGroup>
          ) : (
            <>
              <CommandGroup heading="Suggestions">
                <CommandItem onSelect={() => setInputValue("Move my task to In Progress")}>
                  <Move className="mr-2 h-4 w-4" />
                  <span>Move Task...</span>
                </CommandItem>
                <CommandItem onSelect={() => setInputValue("Split the 'Auth Module' task")}>
                  <Split className="mr-2 h-4 w-4" />
                  <span>Split Task with AI...</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
            </>
          )}
          
          <div className="p-4 border-t bg-muted/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Gợi ý: Nhấn <b>Enter</b> để gửi lệnh cho AI.</span>
            </div>
          </div>
        </CommandList>
      </CommandDialog>
    </>
  )
}
