"use client"

import { useEffect, useState } from "react"
import { getBoardData, ColumnWithTasks } from "@/lib/data"
import { supabase } from "@/lib/supabase"

export function useKanban(projectId: string) {
  const [data, setData] = useState<ColumnWithTasks[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const boardData = await getBoardData(projectId)
      setData(boardData)
      setLoading(false)
    }

    fetchData()

    // Realtime subscription for tasks
    const taskSubscription = supabase
      .channel('tasks-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks', filter: `project_id=eq.${projectId}` }, 
        () => {
          fetchData() // Simple approach: refetch everything on change
        }
      )
      .subscribe()

    // Realtime subscription for columns
    const columnSubscription = supabase
      .channel('columns-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'columns', filter: `project_id=eq.${projectId}` }, 
        () => {
          fetchData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(taskSubscription)
      supabase.removeChannel(columnSubscription)
    }
  }, [projectId])

  return { data, loading }
}
