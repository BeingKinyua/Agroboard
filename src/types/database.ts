/**
 * Database definitions reflecting the target Supabase/PostgreSQL schema for Agro-Deliveries Ke.
 * Powering BOS, future E-Commerce, B2B Institutional Portal, and POS frontend surfaces.
 */

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
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: string;
          role_title: string;
          branch: string;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role: string;
          role_title: string;
          branch?: string;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: string;
          role_title?: string;
          branch?: string;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          code: string;
          name: string;
          type: string;
          contact_person: string;
          phone: string;
          email: string;
          zone: string;
          payment_terms: string;
          credit_limit: number;
          current_balance: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          type: string;
          contact_person: string;
          phone: string;
          email: string;
          zone: string;
          payment_terms?: string;
          credit_limit?: number;
          current_balance?: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          type?: string;
          contact_person?: string;
          phone?: string;
          email?: string;
          zone?: string;
          payment_terms?: string;
          credit_limit?: number;
          current_balance?: number;
          status?: string;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          sku: string;
          name: string;
          category: string;
          unit: string;
          unit_price: number;
          cost_price: number;
          current_stock: number;
          min_stock_level: number;
          shelf_life_days: number;
          storage_temperature: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          sku: string;
          name: string;
          category: string;
          unit: string;
          unit_price: number;
          cost_price: number;
          current_stock?: number;
          min_stock_level?: number;
          shelf_life_days?: number;
          storage_temperature?: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          sku?: string;
          name?: string;
          category?: string;
          unit?: string;
          unit_price?: number;
          cost_price?: number;
          current_stock?: number;
          min_stock_level?: number;
          shelf_life_days?: number;
          storage_temperature?: string;
          status?: string;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string;
          order_date: string;
          delivery_date: string;
          delivery_window: string;
          zone: string;
          total_amount: number;
          status: string;
          payment_status: string;
          special_instructions: string | null;
          assigned_run_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_id: string;
          order_date?: string;
          delivery_date: string;
          delivery_window: string;
          zone: string;
          total_amount: number;
          status?: string;
          payment_status?: string;
          special_instructions?: string | null;
          assigned_run_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_id?: string;
          order_date?: string;
          delivery_date?: string;
          delivery_window?: string;
          zone?: string;
          total_amount?: number;
          status?: string;
          payment_status?: string;
          special_instructions?: string | null;
          assigned_run_id?: string | null;
          created_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity_ordered: number;
          quantity_picked: number;
          unit_price: number;
          total_price: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity_ordered: number;
          quantity_picked?: number;
          unit_price: number;
          total_price: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity_ordered?: number;
          quantity_picked?: number;
          unit_price?: number;
          total_price?: number;
        };
      };
      inventory_batches: {
        Row: {
          id: string;
          product_id: string;
          batch_number: string;
          intake_date: string;
          expiry_date: string;
          initial_quantity: number;
          remaining_quantity: number;
          unit: string;
          warehouse_location: string;
          status: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          batch_number: string;
          intake_date: string;
          expiry_date: string;
          initial_quantity: number;
          remaining_quantity: number;
          unit: string;
          warehouse_location: string;
          status?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          batch_number?: string;
          intake_date?: string;
          expiry_date?: string;
          initial_quantity?: number;
          remaining_quantity?: number;
          unit?: string;
          warehouse_location?: string;
          status?: string;
        };
      };
      delivery_runs: {
        Row: {
          id: string;
          run_code: string;
          route_name: string;
          driver_name: string;
          driver_phone: string;
          vehicle_registration: string;
          departure_time: string;
          order_count: number;
          status: string;
        };
        Insert: {
          id?: string;
          run_code: string;
          route_name: string;
          driver_name: string;
          driver_phone: string;
          vehicle_registration: string;
          departure_time: string;
          order_count?: number;
          status?: string;
        };
        Update: {
          id?: string;
          run_code?: string;
          route_name?: string;
          driver_name?: string;
          driver_phone?: string;
          vehicle_registration?: string;
          departure_time?: string;
          order_count?: number;
          status?: string;
        };
      };
      purchase_orders: {
        Row: {
          id: string;
          po_number: string;
          supplier_id: string;
          created_date: string;
          expected_delivery: string;
          total_amount: number;
          status: string;
        };
        Insert: {
          id?: string;
          po_number: string;
          supplier_id: string;
          created_date?: string;
          expected_delivery: string;
          total_amount: number;
          status?: string;
        };
        Update: {
          id?: string;
          po_number?: string;
          supplier_id?: string;
          created_date?: string;
          expected_delivery?: string;
          total_amount?: number;
          status?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          invoice_number: string;
          order_id: string;
          customer_id: string;
          issue_date: string;
          due_date: string;
          total_amount: number;
          amount_paid: number;
          status: string;
        };
        Insert: {
          id?: string;
          invoice_number: string;
          order_id: string;
          customer_id: string;
          issue_date?: string;
          due_date: string;
          total_amount: number;
          amount_paid?: number;
          status?: string;
        };
        Update: {
          id?: string;
          invoice_number?: string;
          order_id?: string;
          customer_id?: string;
          issue_date?: string;
          due_date?: string;
          total_amount?: number;
          amount_paid?: number;
          status?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          timestamp: string;
          user_id: string;
          user_name: string;
          role: string;
          module: string;
          action: string;
          entity_id: string;
          entity_type: string;
          details: string;
          ip_address: string;
        };
        Insert: {
          id?: string;
          timestamp?: string;
          user_id?: string;
          user_name: string;
          role: string;
          module: string;
          action: string;
          entity_id: string;
          entity_type: string;
          details: string;
          ip_address?: string;
        };
        Update: {
          id?: string;
          timestamp?: string;
          user_id?: string;
          user_name?: string;
          role?: string;
          module?: string;
          action?: string;
          entity_id?: string;
          entity_type?: string;
          details?: string;
          ip_address?: string;
        };
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
  };
}
