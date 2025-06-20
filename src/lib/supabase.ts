import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://oqukzcgkqkteclpqpguj.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdWt6Y2drcWt0ZWNscHFwZ3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MTAyOTgsImV4cCI6MjA2NTk4NjI5OH0.vl9N_bQxwcoZREu4erC6dRGM4FbjjxsxiQOkSUaDNoo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// データベースのテーブル型定義
export interface Database {
  public: {
    Tables: {
      expenses: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          category: string;
          amount: number;
          memo: string;
          type: "income" | "expense";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          category: string;
          amount: number;
          memo?: string;
          type: "income" | "expense";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          category?: string;
          amount?: number;
          memo?: string;
          type?: "income" | "expense";
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          is_default: boolean;
          type: "income" | "expense";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color: string;
          is_default?: boolean;
          type: "income" | "expense";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          is_default?: boolean;
          type?: "income" | "expense";
          created_at?: string;
        };
      };
      saving_targets: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: string;
          amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: string;
          amount?: number;
          created_at?: string;
        };
      };
    };
  };
}
