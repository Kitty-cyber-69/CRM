export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          created_at: string
          name: string
          company: string
          email: string
          phone: string
          tags: string[] | null
          notes: string | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          company: string
          email: string
          phone: string
          tags?: string[] | null
          notes?: string | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          company?: string
          email?: string
          phone?: string
          tags?: string[] | null
          notes?: string | null
          user_id?: string
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          name: string
          status: string
          start_date: string
          deadline: string | null
          end_date: string | null
          budget: number | null
          customer_id: string
          description: string | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          status: string
          start_date: string
          deadline?: string | null
          end_date?: string | null
          budget?: number | null
          customer_id: string
          description?: string | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          status?: string
          start_date?: string
          deadline?: string | null
          end_date?: string | null
          budget?: number | null
          customer_id?: string
          description?: string | null
          user_id?: string
        }
      }
      milestones: {
        Row: {
          id: string
          created_at: string
          name: string
          status: string
          deadline: string | null
          project_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          status: string
          deadline?: string | null
          project_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          status?: string
          deadline?: string | null
          project_id?: string
        }
      }
    }
  }
}