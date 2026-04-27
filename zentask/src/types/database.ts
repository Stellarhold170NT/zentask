export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          owner_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          owner_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          owner_id?: string
          created_at?: string
        }
      }
      columns: {
        Row: {
          id: string
          project_id: string
          title: string
          order_index: number
          wip_limit: number | null
          exit_policy: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          order_index?: number
          wip_limit?: number | null
          exit_policy?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          order_index?: number
          wip_limit?: number | null
          exit_policy?: string | null
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          column_id: string
          project_id: string
          title: string
          description: string | null
          order_index: number
          assignee_id: string | null
          priority: 'low' | 'medium' | 'high' | 'urgent'
          end_date: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          column_id: string
          project_id: string
          title: string
          description?: string | null
          order_index?: number
          assignee_id?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          end_date?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          column_id?: string
          project_id?: string
          title?: string
          description?: string | null
          order_index?: number
          assignee_id?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          end_date?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      priority_level: 'low' | 'medium' | 'high' | 'urgent'
    }
  }
}
