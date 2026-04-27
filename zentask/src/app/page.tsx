"use client"

import * as React from "react"
import { KanbanBoard } from "@/components/kanban/kanban-board"
import { CommandPalette } from "@/components/kanban/command-palette"
import { Search, Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false)

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Zentask
          </h1>
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-muted-foreground">
            <Button variant="ghost" className="text-foreground">Board</Button>
            <Button variant="ghost">Timeline</Button>
            <Button variant="ghost">Analytics</Button>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search tasks... (Cmd+K)"
              className="pl-9 h-9 w-64 rounded-md border bg-muted/50 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
              readOnly
              onClick={() => setIsCommandPaletteOpen(true)}
            />
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
            JD
          </div>
        </div>
      </header>

      {/* Main Board Area */}
      <main className="flex-1 overflow-hidden bg-zinc-50/50 dark:bg-black/20">
        <KanbanBoard />
      </main>

      {/* AI Command Palette */}
      <CommandPalette 
        open={isCommandPaletteOpen} 
        setOpen={setIsCommandPaletteOpen} 
      />

      {/* Quick AI Command Hint */}
      <div 
        onClick={() => setIsCommandPaletteOpen(true)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center gap-2 text-sm font-medium animate-bounce cursor-pointer"
      >
        <span className="bg-primary-foreground/20 px-1.5 py-0.5 rounded text-[10px]">Cmd + K</span>
        Ask AI to move or split tasks...
      </div>
    </div>
  )
}
