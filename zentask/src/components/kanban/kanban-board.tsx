"use client"

import { useKanban } from "@/hooks/use-kanban"
import { KanbanColumn } from "./kanban-column"
import { Loader2 } from "lucide-react"

// Placeholder Project ID - in a real app, this would come from the URL or state
const MOCK_PROJECT_ID = "00000000-0000-0000-0000-000000000000"

export function KanbanBoard() {
  const { data: columns, loading } = useKanban(MOCK_PROJECT_ID)

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex gap-4 p-6 overflow-x-auto min-h-[calc(100vh-100px)] items-start">
      {columns.map((column) => (
        <KanbanColumn key={column.id} column={column} />
      ))}
      
      {/* Nút thêm cột mới */}
      <button className="flex items-center justify-center w-80 shrink-0 h-12 border-2 border-dashed rounded-lg text-muted-foreground hover:text-foreground hover:border-foreground transition-all">
        + Add another list
      </button>
    </div>
  )
}
