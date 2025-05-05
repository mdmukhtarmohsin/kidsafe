export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      parents: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          name: string;
          avatar_url: string | null;
          password_hash: string;
          phone_number: string | null;
          notification_preferences: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email: string;
          name: string;
          avatar_url?: string | null;
          password_hash: string;
          phone_number?: string | null;
          notification_preferences?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email?: string;
          name?: string;
          avatar_url?: string | null;
          password_hash?: string;
          phone_number?: string | null;
          notification_preferences?: Json;
        };
        Relationships: [];
      };
      children: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          parent_id: string;
          name: string;
          age: number | null;
          avatar_url: string | null;
          pin: string | null;
          daily_limit: number;
          time_used: number;
          status: string | null;
          last_active: string | null;
          bedtime_start: string | null;
          bedtime_end: string | null;
          bedtime_enabled: boolean | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          parent_id: string;
          name: string;
          age?: number | null;
          avatar_url?: string | null;
          pin?: string | null;
          daily_limit?: number;
          time_used?: number;
          status?: string | null;
          last_active?: string | null;
          bedtime_start?: string | null;
          bedtime_end?: string | null;
          bedtime_enabled?: boolean | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          parent_id?: string;
          name?: string;
          age?: number | null;
          avatar_url?: string | null;
          pin?: string | null;
          daily_limit?: number;
          time_used?: number;
          status?: string | null;
          last_active?: string | null;
          bedtime_start?: string | null;
          bedtime_end?: string | null;
          bedtime_enabled?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "children_parent_id_fkey";
            columns: ["parent_id"];
            referencedRelation: "parents";
            referencedColumns: ["id"];
          }
        ];
      };
      devices: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          child_id: string;
          device_id: string;
          device_name: string;
          device_type: string;
          os_type: string | null;
          last_active: string | null;
          is_active: boolean | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          child_id: string;
          device_id: string;
          device_name: string;
          device_type: string;
          os_type?: string | null;
          last_active?: string | null;
          is_active?: boolean | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          child_id?: string;
          device_id?: string;
          device_name?: string;
          device_type?: string;
          os_type?: string | null;
          last_active?: string | null;
          is_active?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "devices_child_id_fkey";
            columns: ["child_id"];
            referencedRelation: "children";
            referencedColumns: ["id"];
          }
        ];
      };
      content_rules: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          child_id: string;
          url: string | null;
          category: string | null;
          is_blocked: boolean;
          rule_type: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          child_id: string;
          url?: string | null;
          category?: string | null;
          is_blocked?: boolean;
          rule_type: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          child_id?: string;
          url?: string | null;
          category?: string | null;
          is_blocked?: boolean;
          rule_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "content_rules_child_id_fkey";
            columns: ["child_id"];
            referencedRelation: "children";
            referencedColumns: ["id"];
          }
        ];
      };
      usage_logs: {
        Row: {
          id: string;
          created_at: string;
          child_id: string;
          device_id: string | null;
          app_name: string;
          url: string | null;
          category: string | null;
          duration: number;
          start_time: string;
          end_time: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          child_id: string;
          device_id?: string | null;
          app_name: string;
          url?: string | null;
          category?: string | null;
          duration: number;
          start_time: string;
          end_time?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          child_id?: string;
          device_id?: string | null;
          app_name?: string;
          url?: string | null;
          category?: string | null;
          duration?: number;
          start_time?: string;
          end_time?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "usage_logs_child_id_fkey";
            columns: ["child_id"];
            referencedRelation: "children";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "usage_logs_device_id_fkey";
            columns: ["device_id"];
            referencedRelation: "devices";
            referencedColumns: ["id"];
          }
        ];
      };
      blocked_attempts: {
        Row: {
          id: string;
          created_at: string;
          child_id: string;
          device_id: string | null;
          url: string | null;
          app_name: string | null;
          reason: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          child_id: string;
          device_id?: string | null;
          url?: string | null;
          app_name?: string | null;
          reason: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          child_id?: string;
          device_id?: string | null;
          url?: string | null;
          app_name?: string | null;
          reason?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blocked_attempts_child_id_fkey";
            columns: ["child_id"];
            referencedRelation: "children";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blocked_attempts_device_id_fkey";
            columns: ["device_id"];
            referencedRelation: "devices";
            referencedColumns: ["id"];
          }
        ];
      };
      alerts: {
        Row: {
          id: string;
          created_at: string;
          parent_id: string;
          child_id: string;
          type: string;
          message: string;
          read: boolean;
          urgent: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          parent_id: string;
          child_id: string;
          type: string;
          message: string;
          read?: boolean;
          urgent?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          parent_id?: string;
          child_id?: string;
          type?: string;
          message?: string;
          read?: boolean;
          urgent?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "alerts_child_id_fkey";
            columns: ["child_id"];
            referencedRelation: "children";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "alerts_parent_id_fkey";
            columns: ["parent_id"];
            referencedRelation: "parents";
            referencedColumns: ["id"];
          }
        ];
      };
      alert_settings: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          parent_id: string;
          alert_type: string;
          enabled: boolean;
          email_notification: boolean;
          push_notification: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          parent_id: string;
          alert_type: string;
          enabled?: boolean;
          email_notification?: boolean;
          push_notification?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          parent_id?: string;
          alert_type?: string;
          enabled?: boolean;
          email_notification?: boolean;
          push_notification?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "alert_settings_parent_id_fkey";
            columns: ["parent_id"];
            referencedRelation: "parents";
            referencedColumns: ["id"];
          }
        ];
      };
      app_settings: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          parent_id: string;
          theme: string | null;
          language: string | null;
          auto_lock: boolean | null;
          bedtime_mode: boolean | null;
          data_collection: boolean | null;
          auto_updates: boolean | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          parent_id: string;
          theme?: string | null;
          language?: string | null;
          auto_lock?: boolean | null;
          bedtime_mode?: boolean | null;
          data_collection?: boolean | null;
          auto_updates?: boolean | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          parent_id?: string;
          theme?: string | null;
          language?: string | null;
          auto_lock?: boolean | null;
          bedtime_mode?: boolean | null;
          data_collection?: boolean | null;
          auto_updates?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "app_settings_parent_id_fkey";
            columns: ["parent_id"];
            referencedRelation: "parents";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
