import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Database } from "@/types/database"

export type DBTask = Database['public']['Tables']['tasks']['Row']

const priorityColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function KanbanCard({ task }: { task: DBTask }) {
  return (
    <Card className="mb-3 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors shadow-sm">
      <CardHeader className="p-3 pb-0 flex flex-row items-start justify-between space-y-0">
        <Badge variant="secondary" className={priorityColors[task.priority || 'medium']}>
          {task.priority}
        </Badge>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <CardTitle className="text-sm font-bold leading-tight mb-1">
          {task.title}
        </CardTitle>
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {task.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-xs text-muted-foreground">
            {task.end_date && (
              <>
                <CalendarDays className="mr-1 h-3 w-3" />
                {new Date(task.end_date).toLocaleDateString()}
              </>
            )}
          </div>
          {/* Placeholder for assignee logic */}
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-[10px]">
              ??
            </AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  )
}
