import { supabase } from "./supabase"
import { Database } from "@/types/database"

export type ColumnWithTasks = Database['public']['Tables']['columns']['Row'] & {
  tasks: Database['public']['Tables']['tasks']['Row'][]
}

export async function getBoardData(projectId: string): Promise<ColumnWithTasks[]> {
  // 1. Fetch columns
  const { data: columns, error: colError } = await supabase
    .from('columns')
    .select('*')
    .eq('project_id', projectId)
    .order('order_index', { ascending: true })

  if (colError) {
    console.error('Error fetching columns:', colError)
    return []
  }

  // 2. Fetch tasks for all columns in this project
  const { data: tasks, error: taskError } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('order_index', { ascending: true })

  if (taskError) {
    console.error('Error fetching tasks:', taskError)
    return columns.map(col => ({ ...col, tasks: [] }))
  }

  // 3. Map tasks to their respective columns
  return columns.map(col => ({
    ...col,
    tasks: tasks.filter(task => task.column_id === col.id)
  }))
}
