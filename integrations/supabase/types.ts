export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      availabilities: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          start_time: string
          teacher_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          start_time: string
          teacher_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          start_time?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "availabilities_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          mode: string | null
          role: string
          timestamp: number
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          mode?: string | null
          role: string
          timestamp: number
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          mode?: string | null
          role?: string
          timestamp?: number
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ia_flashcards: {
        Row: {
          answer: string
          generated_at: string
          id: string
          question: string
          theme: string
          user_id: string
        }
        Insert: {
          answer: string
          generated_at?: string
          id?: string
          question: string
          theme: string
          user_id: string
        }
        Update: {
          answer?: string
          generated_at?: string
          id?: string
          question?: string
          theme?: string
          user_id?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          lesson_id: string | null
          quantity: number | null
          total: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          lesson_id?: string | null
          quantity?: number | null
          total: number
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          lesson_id?: string | null
          quantity?: number | null
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          end_period: string
          id: string
          invoice_number: string
          parent_id: string
          pdf_url: string | null
          start_period: string
          status: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          end_period: string
          id?: string
          invoice_number: string
          parent_id: string
          pdf_url?: string | null
          start_period: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          end_period?: string
          id?: string
          invoice_number?: string
          parent_id?: string
          pdf_url?: string | null
          start_period?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parents"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          created_at: string
          end_at: string
          google_event_id: string | null
          id: string
          meeting_link: string | null
          notes_student: string | null
          notes_teacher: string | null
          outlook_event_id: string | null
          platform: string | null
          start_at: string
          status: string | null
          student_id: string
          subject: string
          teacher_id: string
          updated_at: string
          zoom_meeting_id: string | null
        }
        Insert: {
          created_at?: string
          end_at: string
          google_event_id?: string | null
          id?: string
          meeting_link?: string | null
          notes_student?: string | null
          notes_teacher?: string | null
          outlook_event_id?: string | null
          platform?: string | null
          start_at: string
          status?: string | null
          student_id: string
          subject: string
          teacher_id: string
          updated_at?: string
          zoom_meeting_id?: string | null
        }
        Update: {
          created_at?: string
          end_at?: string
          google_event_id?: string | null
          id?: string
          meeting_link?: string | null
          notes_student?: string | null
          notes_teacher?: string | null
          outlook_event_id?: string | null
          platform?: string | null
          start_at?: string
          status?: string | null
          student_id?: string
          subject?: string
          teacher_id?: string
          updated_at?: string
          zoom_meeting_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read_at: string | null
          recipient_id: string
          sender_id: string
          subject: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
          subject?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          subject?: string | null
        }
        Relationships: []
      }
      mind_maps: {
        Row: {
          connections: Json
          created_at: string
          id: string
          nodes: Json
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          connections?: Json
          created_at?: string
          id?: string
          nodes?: Json
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          connections?: Json
          created_at?: string
          id?: string
          nodes?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      parents: {
        Row: {
          billing_address: string | null
          created_at: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_address?: string | null
          created_at?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_address?: string | null
          created_at?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          difficulty: string | null
          duration_minutes: number | null
          id: string
          tags: string[] | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          duration_minutes?: number | null
          id?: string
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          duration_minutes?: number | null
          id?: string
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          created_at: string
          grade_level: string | null
          id: string
          parent_id: string | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          grade_level?: string | null
          id?: string
          parent_id?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          grade_level?: string | null
          id?: string
          parent_id?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      teachers: {
        Row: {
          bio: string | null
          created_at: string
          google_calendar_token: string | null
          hourly_rate: number | null
          id: string
          outlook_calendar_token: string | null
          subjects: string[] | null
          timezone: string | null
          updated_at: string
          user_id: string
          zoom_api_key: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          google_calendar_token?: string | null
          hourly_rate?: number | null
          id?: string
          outlook_calendar_token?: string | null
          subjects?: string[] | null
          timezone?: string | null
          updated_at?: string
          user_id: string
          zoom_api_key?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          google_calendar_token?: string | null
          hourly_rate?: number | null
          id?: string
          outlook_calendar_token?: string | null
          subjects?: string[] | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
          zoom_api_key?: string | null
        }
        Relationships: []
      }
      user_fiches: {
        Row: {
          contenu: string
          created_at: string
          id: string
          tags: string[] | null
          titre: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contenu: string
          created_at?: string
          id?: string
          tags?: string[] | null
          titre: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contenu?: string
          created_at?: string
          id?: string
          tags?: string[] | null
          titre?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_flashcards: {
        Row: {
          answer: string
          created_at: string
          id: string
          question: string
          theme: string
          user_id: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          question: string
          theme: string
          user_id: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          question?: string
          theme?: string
          user_id?: string
        }
        Relationships: []
      }
      user_metrics: {
        Row: {
          created_at: string
          current_focus: string | null
          focus_progress: number | null
          id: string
          longest_streak: number | null
          sessions_this_week: number | null
          streak: number | null
          today_study_minutes: number | null
          total_sessions: number | null
          updated_at: string
          user_id: string
          week_study_minutes: number | null
          weekly_goal: number | null
        }
        Insert: {
          created_at?: string
          current_focus?: string | null
          focus_progress?: number | null
          id?: string
          longest_streak?: number | null
          sessions_this_week?: number | null
          streak?: number | null
          today_study_minutes?: number | null
          total_sessions?: number | null
          updated_at?: string
          user_id: string
          week_study_minutes?: number | null
          weekly_goal?: number | null
        }
        Update: {
          created_at?: string
          current_focus?: string | null
          focus_progress?: number | null
          id?: string
          longest_streak?: number | null
          sessions_this_week?: number | null
          streak?: number | null
          today_study_minutes?: number | null
          total_sessions?: number | null
          updated_at?: string
          user_id?: string
          week_study_minutes?: number | null
          weekly_goal?: number | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          current_level: string | null
          first_name: string
          id: string
          main_challenge: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_level?: string | null
          first_name: string
          id?: string
          main_challenge?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_level?: string | null
          first_name?: string
          id?: string
          main_challenge?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_quiz_results: {
        Row: {
          correct_answers: number
          date: string
          id: string
          questions_total: number
          score: number
          theme: string
          user_id: string
        }
        Insert: {
          correct_answers: number
          date?: string
          id?: string
          questions_total: number
          score: number
          theme: string
          user_id: string
        }
        Update: {
          correct_answers?: number
          date?: string
          id?: string
          questions_total?: number
          score?: number
          theme?: string
          user_id?: string
        }
        Relationships: []
      }
      user_resources: {
        Row: {
          created_at: string
          id: string
          last_accessed: string | null
          progress: number | null
          resource_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_accessed?: string | null
          progress?: number | null
          resource_id: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_accessed?: string | null
          progress?: number | null
          resource_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_resources_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_user_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "teacher" | "parent" | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "teacher", "parent", "super_admin"],
    },
  },
} as const
