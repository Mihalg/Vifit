/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
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
      appointments: {
        Row: {
          age: number | null
          client_id: string | null
          created_at: string
          date: string | null
          dietitian_id: string | null
          id: number
          notes: string | null
        }
        Insert: {
          age?: number | null
          client_id?: string | null
          created_at?: string
          date?: string | null
          dietitian_id?: string | null
          id?: number
          notes?: string | null
        }
        Update: {
          age?: number | null
          client_id?: string | null
          created_at?: string
          date?: string | null
          dietitian_id?: string | null
          id?: number
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_dietitian_id_fkey"
            columns: ["dietitian_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          client_id: string | null
          created_at: string
          dietitian_id: string | null
          id: number
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          dietitian_id?: string | null
          id?: number
        }
        Update: {
          client_id?: string | null
          created_at?: string
          dietitian_id?: string | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "clients_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_dietitian_id_fkey"
            columns: ["dietitian_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      dish_ingredients: {
        Row: {
          created_at: string
          dish_id: number | null
          id: number
          ingredient_id: number | null
          quantity: number | null
        }
        Insert: {
          created_at?: string
          dish_id?: number | null
          id?: number
          ingredient_id?: number | null
          quantity?: number | null
        }
        Update: {
          created_at?: string
          dish_id?: number | null
          id?: number
          ingredient_id?: number | null
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dish_ingredients_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      dishes: {
        Row: {
          calories: number | null
          created_at: string
          description: string | null
          dietitian_id: string | null
          id: number
          name: string | null
        }
        Insert: {
          calories?: number | null
          created_at?: string
          description?: string | null
          dietitian_id?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          calories?: number | null
          created_at?: string
          description?: string | null
          dietitian_id?: string | null
          id?: number
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dishes_dietitian_id_fkey"
            columns: ["dietitian_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          created_at: string
          id: number
          name: string | null
          unit: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          unit?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          unit?: string | null
        }
        Relationships: []
      }
      meal_dishes: {
        Row: {
          created_at: string
          dish_id: number | null
          id: number
          meal_id: number | null
        }
        Insert: {
          created_at?: string
          dish_id?: number | null
          id?: number
          meal_id?: number | null
        }
        Update: {
          created_at?: string
          dish_id?: number | null
          id?: number
          meal_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_dishes_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_dishes_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          client_id: string | null
          created_at: string
          dietitian_id: string | null
          id: number
          name: string | null
          time: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          dietitian_id?: string | null
          id?: number
          name?: string | null
          time?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          dietitian_id?: string | null
          id?: number
          name?: string | null
          time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meals_dietitian_id_fkey"
            columns: ["dietitian_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

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
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

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
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
