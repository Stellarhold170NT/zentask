import { supabase } from "./supabase"
import { Database } from "@/types/database"

export type TaskUpdate = Database['public']['Tables']['tasks']['Update']

/**
 * Moves a task to a different column or a different position within the same column.
 */
export async function moveTask(taskId: string, columnId: string, orderIndex: number) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ 
      column_id: columnId, 
      order_index: orderIndex,
      updated_at: new Date().toISOString() 
    })
    .eq('id', taskId)
    .select()

  if (error) throw error
  return data[0]
}

/**
 * Updates task metadata like due date, priority, or assignee.
 */
export async function updateTask(taskId: string, updates: TaskUpdate) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ 
      ...updates,
      updated_at: new Date().toISOString() 
    })
    .eq('id', taskId)
    .select()

  if (error) throw error
  return data[0]
}

/**
 * Splits a large task into multiple smaller tasks.
 * This is a generative action often triggered by AI.
 */
export async function splitTaskIntoSubtasks(parentTaskId: string, subtasks: { title: string, description?: string }[]) {
  // 1. Get the parent task to copy some context (project_id, column_id)
  const { data: parentTask, error: fetchError } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', parentTaskId)
    .single()

  if (fetchError) throw fetchError

  // 2. Prepare the new tasks
  const newTasks = subtasks.map((st, index) => ({
    title: st.title,
    description: st.description,
    project_id: parentTask.project_id,
    column_id: parentTask.column_id,
    order_index: parentTask.order_index + index + 1, // Place them after the parent
    priority: parentTask.priority,
  }))

  // 3. Insert new tasks
  const { data, error: insertError } = await supabase
    .from('tasks')
    .insert(newTasks)
    .select()

  if (insertError) throw insertError

  // 4. Optionally archive or mark the parent task as "Split"
  await supabase
    .from('tasks')
    .update({ title: `[SPLIT] ${parentTask.title}`, updated_at: new Date().toISOString() })
    .eq('id', parentTaskId)

  return data
}

/**
 * Fetches tasks based on a natural language search query.
 */
export async function searchTasks(projectId: string, query: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, columns(title)')
    .eq('project_id', projectId)
    .ilike('title', `%${query}%`)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
