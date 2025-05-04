import { ReactNode } from "react";

/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          age: number | null;
          created_at: string;
          date: string | null;
          dietitian_id: string | null;
          fat_weight: number;
          height: number;
          id: number;
          muscle_weight: number | null;
          notes: string | null;
          pal: number;
          patient_id: number;
          water_weight: number;
          weight: number;
        };
        Insert: {
          age?: number | null;
          created_at?: string;
          date?: string | null;
          dietitian_id?: string | null;
          fat_weight?: number | null;
          height?: number | null;
          id?: number;
          muscle_weight?: number | null;
          notes?: string | null;
          pal?: number;
          patient_id?: number | null;
          water_weight?: number | null;
          weight?: number | null;
        };
        Update: {
          age?: number | null;
          created_at?: string;
          date?: string | null;
          dietitian_id?: string | null;
          fat_weight?: number | null;
          height?: number | null;
          id?: number;
          muscle_weight?: number | null;
          notes?: string | null;
          pal?: number;
          patient_id?: number | null;
          water_weight?: number | null;
          weight?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_dietitian_id_fkey";
            columns: ["dietitian_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "appointments_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      dish_ingredients: {
        Row: {
          created_at: string;
          dish_id: number;
          id: number;
          ingredient_id: number;
          quantity: number;
          quantity_in_words: string;
        };
        Insert: {
          created_at?: string;
          dish_id?: number | null;
          id?: number;
          ingredient_id?: number | null;
          quantity?: number | null;
          quantity_in_words?: string | null;
        };
        Update: {
          created_at?: string;
          dish_id?: number | null;
          id?: number;
          ingredient_id?: number | null;
          quantity?: number | null;
          quantity_in_words?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "dish_ingredients_dish_id_fkey";
            columns: ["dish_id"];
            isOneToOne: false;
            referencedRelation: "dishes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "dish_ingredients_ingredient_id_fkey";
            columns: ["ingredient_id"];
            isOneToOne: false;
            referencedRelation: "ingredients";
            referencedColumns: ["id"];
          },
        ];
      };
      dishes: {
        Row: {
          id?: number;
          name: string;
          category: string;
          calories: number;
          created_at: string;
          description: string;
          dietitian_id: string;
          carbs: number;
          fat: number;
          proteins: number;
        };
        Insert: {
          calories?: number | null;
          category?: string | null;
          created_at?: string;
          description?: string | null;
          dietitian_id?: string | null;
          id?: number;
          name?: string | null;
          carbs: number;
          fat: number;
          proteins: number;
        };
        Update: {
          calories?: number | null;
          category?: string | null;
          created_at?: string;
          description?: string | null;
          dietitian_id?: string | null;
          id?: number;
          name?: string | null;
          carbs?: number;
          fat?: number;
          proteins?: number;
        };
        Relationships: [
          {
            foreignKeyName: "dishes_dietitian_id_fkey";
            columns: ["dietitian_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      ingredients: {
        Row: {
          category: string;
          created_at: string;
          dietitian_id: string;
          id: number;
          name: string;
          unit: string;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          dietitian_id?: string | null;
          id?: number;
          name?: string | null;
          unit?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          dietitian_id?: string | null;
          id?: number;
          name?: string | null;
          unit?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "ingredients_dietitian_id_fkey";
            columns: ["dietitian_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      planned_appointments: {
        Row: {
          created_at: string;
          dietitian_id: string;
          end: Date;
          id: number;
          start: Date;
          title: string;
          subtitle: string | undefined;
        };
        Insert: {
          created_at?: string;
          dietitian_id?: string;
          end?: string | Date;
          id?: number;
          start?: string | Date;
          title?: ReactNode;
          subtitle?: ReactNode | undefined;
        };
        Update: {
          created_at?: string;
          dietitian_id?: string;
          end?: string | Date;
          id?: number;
          start?: string | Date;
          title?: ReactNode;
          subtitle?: ReactNode;
        };
        Relationships: [
          {
            foreignKeyName: "planned_appointments_dietitian_id_fkey";
            columns: ["dietitian_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      meal_dishes: {
        Row: {
          created_at: string;
          dish_id: number;
          id: number;
          meal_id: number;
        };
        Insert: {
          created_at?: string;
          dish_id?: number;
          id?: number;
          meal_id?: number;
        };
        Update: {
          created_at?: string;
          dish_id?: number;
          id?: number;
          meal_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "meal_dishes_dish_id_fkey";
            columns: ["dish_id"];
            isOneToOne: false;
            referencedRelation: "dishes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "meal_dishes_meal_id_fkey";
            columns: ["meal_id"];
            isOneToOne: false;
            referencedRelation: "meals";
            referencedColumns: ["id"];
          },
        ];
      };
      meals: {
        Row: {
          client_id: string;
          created_at: string;
          dietitian_id: string;
          id: number;
          name: string;
          time: string;
          calories: number;
        };
        Insert: {
          client_id?: string;
          created_at?: string;
          dietitian_id?: string;
          id?: number;
          name?: string;
          time?: string;
          calories: number;
        };
        Update: {
          client_id?: string;
          created_at?: string;
          dietitian_id?: string;
          id?: number;
          name?: string;
          time?: string;
          calories?: number;
        };
        Relationships: [];
      };
      patients: {
        Row: {
          created_at: string;
          dietitian_id: string;
          id: number;
          patient_id: string;
        };
        Insert: {
          created_at?: string;
          dietitian_id?: string;
          id?: number;
          patient_id?: string;
        };
        Update: {
          created_at?: string;
          dietitian_id?: string | null;
          id?: number;
          patient_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "patients_dietitian_id_fkey";
            columns: ["dietitian_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "patients_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          full_name: string;
          id: number;
          role: string;
          sex: "female" | "male" | null;
          user_id: string;
          email: string;
        };
        Insert: {
          created_at?: string;
          full_name: string;
          id?: number;
          role: string;
          sex: string;
          user_id: string | null;
          email: string;
        };
        Update: {
          created_at?: string;
          full_name?: string;
          id?: number;
          role?: string;
          sex?: string;
          user_id?: string | null;
          email?: string;
        };
        Relationships: [];
      };
      menus: {
        Row: {
          created_at: string;
          id: number;
          name: string;
          dietitian_id: string;
          calories: number;
          carbs?: number;
          fat?: number;
          proteins?: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
          dietitian_id: string;
          calories: number;
          carbs?: number;
          fat?: number;
          proteins?: number;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
          dietitian_id?: string;
          calories?: number;
          carbs?: number;
          fat?: number;
          proteins?: number;
        };
        Relationships: [];
      };
      dishes_menus: {
        Row: {
          created_at: string;
          dish_id: number;
          id: number;
          menu_id: number;
          name: string;
          calories: number;
          time: string;
        };
        Insert: {
          created_at?: string;
          dish_id?: number;
          id?: number;
          menu_id?: number;
          name: string;
          calories: number;
          time: string;
        };
        Update: {
          created_at?: string;
          dish_id?: number;
          id?: number;
          menu_id?: number;
          name?: string;
          calories?: number;
          time?: string;
        };
        Relationships: [
          {
            foreignKeyName: "meal_dishes_dish_id_fkey";
            columns: ["dish_id"];
            isOneToOne: false;
            referencedRelation: "dishes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "meal_dishes_meal_id_fkey";
            columns: ["menu_id"];
            isOneToOne: false;
            referencedRelation: "menus";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
