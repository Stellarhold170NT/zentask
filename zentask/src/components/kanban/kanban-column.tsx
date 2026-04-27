import { KanbanCard } from "./kanban-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MoreHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ColumnWithTasks } from "@/lib/data"

export function KanbanColumn({ column }: { column: ColumnWithTasks }) {
  const wipLimit = column.wip_limit
  const isOverLimit = wipLimit && column.tasks.length > wipLimit

  return (
    <div className="flex flex-col w-80 shrink-0 bg-muted/50 rounded-lg p-2 max-h-full">
      <div className="flex items-center justify-between p-2 mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{column.title}</h3>
          <Badge variant={isOverLimit ? "destructive" : "secondary"} className="text-[10px]">
            {column.tasks.length} {wipLimit ? `/ ${wipLimit}` : ""}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 pr-2">
        <div className="flex flex-col">
          {column.tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
