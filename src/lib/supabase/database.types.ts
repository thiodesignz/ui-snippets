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
      users: {
        Row: {
          id: string
          name: string
          avatar_url: string | null
          plug_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          avatar_url?: string | null
          plug_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          avatar_url?: string | null
          plug_url?: string | null
          created_at?: string
        }
      }
      snippets: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          tags: string[]
          file_url: string | null
          figma_url: string | null
          plug_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          tags: string[]
          file_url?: string | null
          figma_url?: string | null
          plug_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          tags?: string[]
          file_url?: string | null
          figma_url?: string | null
          plug_url?: string | null
          created_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          snippet_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          snippet_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          snippet_id?: string
          created_at?: string
        }
      }
      views: {
        Row: {
          id: string
          user_id: string | null
          snippet_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          snippet_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          snippet_id?: string
          created_at?: string
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
      [_ in never]: never
    }
  }
}
