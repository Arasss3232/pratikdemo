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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_tasks: {
        Row: {
          assigned_by: string | null
          assigned_to: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_at: string | null
          id: string
          notes: string | null
          priority: string
          related_id: string | null
          related_module: string | null
          reminder_at: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_by?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_at?: string | null
          id?: string
          notes?: string | null
          priority?: string
          related_id?: string | null
          related_module?: string | null
          reminder_at?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_by?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_at?: string | null
          id?: string
          notes?: string | null
          priority?: string
          related_id?: string | null
          related_module?: string | null
          reminder_at?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_action_proposals: {
        Row: {
          action_type: string
          after_value: Json
          applied_at: string | null
          applied_by: string | null
          before_value: Json
          conversation_id: string | null
          created_at: string
          created_by: string
          error_message: string | null
          id: string
          message_id: string | null
          proposed_changes: Json
          reversible: boolean
          risk_level: string
          status: string
          summary: string
          target_id: string | null
          target_table: string
          updated_at: string
        }
        Insert: {
          action_type: string
          after_value?: Json
          applied_at?: string | null
          applied_by?: string | null
          before_value?: Json
          conversation_id?: string | null
          created_at?: string
          created_by: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          proposed_changes?: Json
          reversible?: boolean
          risk_level?: string
          status?: string
          summary: string
          target_id?: string | null
          target_table: string
          updated_at?: string
        }
        Update: {
          action_type?: string
          after_value?: Json
          applied_at?: string | null
          applied_by?: string | null
          before_value?: Json
          conversation_id?: string | null
          created_at?: string
          created_by?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          proposed_changes?: Json
          reversible?: boolean
          risk_level?: string
          status?: string
          summary?: string
          target_id?: string | null
          target_table?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_action_proposals_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_action_proposals_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "ai_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_audit_findings: {
        Row: {
          action_type: string | null
          category: string
          created_at: string
          detected_at: string
          id: string
          message_tr: string
          resolved_at: string | null
          severity: string
          snooze_until: string | null
          status: string
          suggestion_tr: string | null
          target_id: string | null
          target_table: string | null
          target_url: string | null
          updated_at: string
        }
        Insert: {
          action_type?: string | null
          category: string
          created_at?: string
          detected_at?: string
          id?: string
          message_tr: string
          resolved_at?: string | null
          severity: string
          snooze_until?: string | null
          status?: string
          suggestion_tr?: string | null
          target_id?: string | null
          target_table?: string | null
          target_url?: string | null
          updated_at?: string
        }
        Update: {
          action_type?: string | null
          category?: string
          created_at?: string
          detected_at?: string
          id?: string
          message_tr?: string
          resolved_at?: string | null
          severity?: string
          snooze_until?: string | null
          status?: string
          suggestion_tr?: string | null
          target_id?: string | null
          target_table?: string | null
          target_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ai_change_bundle_items: {
        Row: {
          bundle_id: string
          position: number
          proposal_id: string
        }
        Insert: {
          bundle_id: string
          position?: number
          proposal_id: string
        }
        Update: {
          bundle_id?: string
          position?: number
          proposal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_change_bundle_items_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "ai_change_bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_change_bundle_items_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "ai_action_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_change_bundles: {
        Row: {
          created_at: string
          created_by: string | null
          description_tr: string | null
          id: string
          status: string
          title_tr: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description_tr?: string | null
          id?: string
          status?: string
          title_tr: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description_tr?: string | null
          id?: string
          status?: string
          title_tr?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_conversations: {
        Row: {
          archived: boolean
          category: string | null
          context_ref: string | null
          created_at: string
          id: string
          last_message_at: string
          pinned: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          archived?: boolean
          category?: string | null
          context_ref?: string | null
          created_at?: string
          id?: string
          last_message_at?: string
          pinned?: boolean
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          archived?: boolean
          category?: string | null
          context_ref?: string | null
          created_at?: string
          id?: string
          last_message_at?: string
          pinned?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json
          proposal_id: string | null
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json
          proposal_id?: string | null
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json
          proposal_id?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_project_preferences: {
        Row: {
          brand_terms: string[]
          created_at: string
          default_mode: string
          extra: Json
          formality: string
          homepage_density: string
          id: string
          singleton: boolean
          tone: string
          updated_at: string
          updated_by: string | null
          visual_style: string
        }
        Insert: {
          brand_terms?: string[]
          created_at?: string
          default_mode?: string
          extra?: Json
          formality?: string
          homepage_density?: string
          id?: string
          singleton?: boolean
          tone?: string
          updated_at?: string
          updated_by?: string | null
          visual_style?: string
        }
        Update: {
          brand_terms?: string[]
          created_at?: string
          default_mode?: string
          extra?: Json
          formality?: string
          homepage_density?: string
          id?: string
          singleton?: boolean
          tone?: string
          updated_at?: string
          updated_by?: string | null
          visual_style?: string
        }
        Relationships: []
      }
      ai_task_items: {
        Row: {
          completed_at: string | null
          created_at: string
          description_tr: string | null
          due_at: string | null
          id: string
          priority: string
          related_finding_id: string | null
          related_proposal_id: string | null
          source: string
          status: string
          title_tr: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description_tr?: string | null
          due_at?: string | null
          id?: string
          priority?: string
          related_finding_id?: string | null
          related_proposal_id?: string | null
          source?: string
          status?: string
          title_tr: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description_tr?: string | null
          due_at?: string | null
          id?: string
          priority?: string
          related_finding_id?: string | null
          related_proposal_id?: string | null
          source?: string
          status?: string
          title_tr?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_task_items_related_finding_id_fkey"
            columns: ["related_finding_id"]
            isOneToOne: false
            referencedRelation: "ai_audit_findings"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_usage_logs: {
        Row: {
          action: string
          created_at: string
          error_message: string | null
          id: string
          latency_ms: number | null
          model: string | null
          status: string
          tokens_in: number | null
          tokens_out: number | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          error_message?: string | null
          id?: string
          latency_ms?: number | null
          model?: string | null
          status?: string
          tokens_in?: number | null
          tokens_out?: number | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          error_message?: string | null
          id?: string
          latency_ms?: number | null
          model?: string | null
          status?: string
          tokens_in?: number | null
          tokens_out?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      approval_requests: {
        Row: {
          approval_no: number
          assigned_approver: string | null
          created_at: string | null
          due_at: string | null
          id: string
          module: string
          previous_values: Json | null
          priority: string
          proposed_values: Json | null
          reason: string | null
          rejection_reason: string | null
          related_id: string
          related_title: string | null
          request_type: string
          requested_action: string
          requested_by: string
          reviewed_at: string | null
          reviewer_note: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          approval_no?: number
          assigned_approver?: string | null
          created_at?: string | null
          due_at?: string | null
          id?: string
          module: string
          previous_values?: Json | null
          priority?: string
          proposed_values?: Json | null
          reason?: string | null
          rejection_reason?: string | null
          related_id: string
          related_title?: string | null
          request_type: string
          requested_action: string
          requested_by: string
          reviewed_at?: string | null
          reviewer_note?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          approval_no?: number
          assigned_approver?: string | null
          created_at?: string | null
          due_at?: string | null
          id?: string
          module?: string
          previous_values?: Json | null
          priority?: string
          proposed_values?: Json | null
          reason?: string | null
          rejection_reason?: string | null
          related_id?: string
          related_title?: string | null
          request_type?: string
          requested_action?: string
          requested_by?: string
          reviewed_at?: string | null
          reviewer_note?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          actor_name: string | null
          correlation_id: string | null
          created_at: string | null
          entity_id: string | null
          entity_title: string | null
          entity_type: string
          error_summary: string | null
          id: string
          ip_address: string | null
          module: string
          new_values: Json | null
          previous_values: Json | null
          status: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          actor_name?: string | null
          correlation_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_title?: string | null
          entity_type: string
          error_summary?: string | null
          id?: string
          ip_address?: string | null
          module: string
          new_values?: Json | null
          previous_values?: Json | null
          status?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          actor_name?: string | null
          correlation_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_title?: string | null
          entity_type?: string
          error_summary?: string | null
          id?: string
          ip_address?: string | null
          module?: string
          new_values?: Json | null
          previous_values?: Json | null
          status?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author: string | null
          body: string | null
          category_id: string | null
          cover_url: string | null
          created_at: string
          excerpt: string | null
          featured: boolean
          id: string
          published: boolean
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          body?: string | null
          category_id?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          id?: string
          published?: boolean
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          body?: string | null
          category_id?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          id?: string
          published?: boolean
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string
          display_order: number
          id: string
          logo_url: string
          name: string
          published: boolean
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          logo_url: string
          name: string
          published?: boolean
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          logo_url?: string
          name?: string
          published?: boolean
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          image_url: string
          issued_at: string | null
          name: string
          published: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url: string
          issued_at?: string | null
          name: string
          published?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string
          issued_at?: string | null
          name?: string
          published?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          account_code: string | null
          account_status: Database["public"]["Enums"]["company_account_status"]
          approval_status: Database["public"]["Enums"]["company_approval_status"]
          approved_at: string | null
          approved_by: string | null
          available_limit: number
          company_type: Database["public"]["Enums"]["company_type"]
          created_at: string
          created_by: string | null
          credit_limit: number
          currency: string
          customer_group_id: string | null
          dealer_level_id: string | null
          id: string
          internal_notes: string | null
          legal_name: string
          payment_term_days: number
          primary_contact_email: string | null
          primary_contact_name: string | null
          primary_contact_phone: string | null
          risk_status: Database["public"]["Enums"]["risk_status"]
          sales_representative_id: string | null
          sector: string | null
          tax_number: string | null
          tax_office: string | null
          trade_name: string | null
          updated_at: string
        }
        Insert: {
          account_code?: string | null
          account_status?: Database["public"]["Enums"]["company_account_status"]
          approval_status?: Database["public"]["Enums"]["company_approval_status"]
          approved_at?: string | null
          approved_by?: string | null
          available_limit?: number
          company_type?: Database["public"]["Enums"]["company_type"]
          created_at?: string
          created_by?: string | null
          credit_limit?: number
          currency?: string
          customer_group_id?: string | null
          dealer_level_id?: string | null
          id?: string
          internal_notes?: string | null
          legal_name: string
          payment_term_days?: number
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          risk_status?: Database["public"]["Enums"]["risk_status"]
          sales_representative_id?: string | null
          sector?: string | null
          tax_number?: string | null
          tax_office?: string | null
          trade_name?: string | null
          updated_at?: string
        }
        Update: {
          account_code?: string | null
          account_status?: Database["public"]["Enums"]["company_account_status"]
          approval_status?: Database["public"]["Enums"]["company_approval_status"]
          approved_at?: string | null
          approved_by?: string | null
          available_limit?: number
          company_type?: Database["public"]["Enums"]["company_type"]
          created_at?: string
          created_by?: string | null
          credit_limit?: number
          currency?: string
          customer_group_id?: string | null
          dealer_level_id?: string | null
          id?: string
          internal_notes?: string | null
          legal_name?: string
          payment_term_days?: number
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          risk_status?: Database["public"]["Enums"]["risk_status"]
          sales_representative_id?: string | null
          sector?: string | null
          tax_number?: string | null
          tax_office?: string | null
          trade_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "companies_customer_group_id_fkey"
            columns: ["customer_group_id"]
            isOneToOne: false
            referencedRelation: "customer_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_dealer_level_id_fkey"
            columns: ["dealer_level_id"]
            isOneToOne: false
            referencedRelation: "dealer_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_sales_representative_id_fkey"
            columns: ["sales_representative_id"]
            isOneToOne: false
            referencedRelation: "sales_representatives"
            referencedColumns: ["id"]
          },
        ]
      }
      company_addresses: {
        Row: {
          address_type: Database["public"]["Enums"]["address_type"]
          city: string
          company_id: string
          contact_name: string | null
          contact_phone: string | null
          country: string
          created_at: string
          district: string | null
          id: string
          is_default: boolean
          label: string | null
          line1: string
          line2: string | null
          notes: string | null
          postal_code: string | null
          updated_at: string
        }
        Insert: {
          address_type: Database["public"]["Enums"]["address_type"]
          city: string
          company_id: string
          contact_name?: string | null
          contact_phone?: string | null
          country?: string
          created_at?: string
          district?: string | null
          id?: string
          is_default?: boolean
          label?: string | null
          line1: string
          line2?: string | null
          notes?: string | null
          postal_code?: string | null
          updated_at?: string
        }
        Update: {
          address_type?: Database["public"]["Enums"]["address_type"]
          city?: string
          company_id?: string
          contact_name?: string | null
          contact_phone?: string | null
          country?: string
          created_at?: string
          district?: string | null
          id?: string
          is_default?: boolean
          label?: string | null
          line1?: string
          line2?: string | null
          notes?: string | null
          postal_code?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_addresses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_users: {
        Row: {
          accepted_at: string | null
          company_id: string
          created_at: string
          id: string
          invited_at: string | null
          invited_by: string | null
          is_active: boolean
          is_primary: boolean
          permissions: Json
          role: Database["public"]["Enums"]["company_role"]
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          company_id: string
          created_at?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean
          is_primary?: boolean
          permissions?: Json
          role?: Database["public"]["Enums"]["company_role"]
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          company_id?: string
          created_at?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean
          is_primary?: boolean
          permissions?: Json
          role?: Database["public"]["Enums"]["company_role"]
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          admin_notes: string | null
          created_at: string
          department: string | null
          email: string
          id: string
          kvkk_accepted: boolean
          message: string
          name: string
          phone: string | null
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          department?: string | null
          email: string
          id?: string
          kvkk_accepted?: boolean
          message: string
          name: string
          phone?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          department?: string | null
          email?: string
          id?: string
          kvkk_accepted?: boolean
          message?: string
          name?: string
          phone?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      content_revisions: {
        Row: {
          created_at: string
          created_by: string | null
          full_snapshot: Json
          id: string
          notes: string | null
          page_id: string
          revision_no: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          full_snapshot: Json
          id?: string
          notes?: string | null
          page_id: string
          revision_no: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          full_snapshot?: Json
          id?: string
          notes?: string | null
          page_id?: string
          revision_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_revisions_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "site_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_groups: {
        Row: {
          code: string
          created_at: string
          default_discount_pct: number
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          default_discount_pct?: number
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          default_discount_pct?: number
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      dealer_levels: {
        Row: {
          code: string
          color_hex: string | null
          created_at: string
          discount_pct: number
          id: string
          is_active: boolean
          min_annual_volume: number | null
          name: string
          tier: number
          updated_at: string
        }
        Insert: {
          code: string
          color_hex?: string | null
          created_at?: string
          discount_pct?: number
          id?: string
          is_active?: boolean
          min_annual_volume?: number | null
          name: string
          tier?: number
          updated_at?: string
        }
        Update: {
          code?: string
          color_hex?: string | null
          created_at?: string
          discount_pct?: number
          id?: string
          is_active?: boolean
          min_annual_volume?: number | null
          name?: string
          tier?: number
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          display_order: number
          id: string
          published: boolean
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          display_order?: number
          id?: string
          published?: boolean
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          display_order?: number
          id?: string
          published?: boolean
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_brochures: {
        Row: {
          accent_color: string | null
          created_at: string
          description: string | null
          display_order: number
          end_at: string | null
          eyebrow: string | null
          id: string
          image_alt: string | null
          image_desktop: string
          image_mobile: string | null
          image_tablet: string | null
          is_active: boolean
          overlay_style: string
          primary_cta_href: string | null
          primary_cta_label: string | null
          secondary_cta_href: string | null
          secondary_cta_label: string | null
          start_at: string | null
          subtitle: string | null
          text_theme: string
          title: string
          updated_at: string
        }
        Insert: {
          accent_color?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          end_at?: string | null
          eyebrow?: string | null
          id?: string
          image_alt?: string | null
          image_desktop: string
          image_mobile?: string | null
          image_tablet?: string | null
          is_active?: boolean
          overlay_style?: string
          primary_cta_href?: string | null
          primary_cta_label?: string | null
          secondary_cta_href?: string | null
          secondary_cta_label?: string | null
          start_at?: string | null
          subtitle?: string | null
          text_theme?: string
          title: string
          updated_at?: string
        }
        Update: {
          accent_color?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          end_at?: string | null
          eyebrow?: string | null
          id?: string
          image_alt?: string | null
          image_desktop?: string
          image_mobile?: string | null
          image_tablet?: string | null
          is_active?: boolean
          overlay_style?: string
          primary_cta_href?: string | null
          primary_cta_label?: string | null
          secondary_cta_href?: string | null
          secondary_cta_label?: string | null
          start_at?: string | null
          subtitle?: string | null
          text_theme?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          admin_notes: string | null
          cover_letter: string | null
          created_at: string
          cv_url: string | null
          email: string
          id: string
          job_id: string | null
          name: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          cover_letter?: string | null
          created_at?: string
          cv_url?: string | null
          email: string
          id?: string
          job_id?: string | null
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          cover_letter?: string | null
          created_at?: string
          cv_url?: string | null
          email?: string
          id?: string
          job_id?: string | null
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      job_posts: {
        Row: {
          body: string | null
          created_at: string
          department: string | null
          display_order: number
          employment_type: string | null
          id: string
          location: string | null
          published: boolean
          slug: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          department?: string | null
          display_order?: number
          employment_type?: string | null
          id?: string
          location?: string | null
          published?: boolean
          slug: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          department?: string | null
          display_order?: number
          employment_type?: string | null
          id?: string
          location?: string | null
          published?: boolean
          slug?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          alt: string | null
          created_at: string
          filename: string
          id: string
          mime_type: string | null
          path: string
          size_bytes: number | null
          uploaded_by: string | null
          url: string
        }
        Insert: {
          alt?: string | null
          created_at?: string
          filename: string
          id?: string
          mime_type?: string | null
          path: string
          size_bytes?: number | null
          uploaded_by?: string | null
          url: string
        }
        Update: {
          alt?: string | null
          created_at?: string
          filename?: string
          id?: string
          mime_type?: string | null
          path?: string
          size_bytes?: number | null
          uploaded_by?: string | null
          url?: string
        }
        Relationships: []
      }
      navigation_items: {
        Row: {
          created_at: string
          desktop_visibility: boolean
          display_order: number
          id: string
          is_active: boolean
          is_external: boolean
          label: string
          mobile_visibility: boolean
          parent_id: string | null
          route: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          desktop_visibility?: boolean
          display_order?: number
          id?: string
          is_active?: boolean
          is_external?: boolean
          label: string
          mobile_visibility?: boolean
          parent_id?: string | null
          route: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          desktop_visibility?: boolean
          display_order?: number
          id?: string
          is_active?: boolean
          is_external?: boolean
          label?: string
          mobile_visibility?: boolean
          parent_id?: string | null
          route?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "navigation_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation_items"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          read_at: string | null
          recipient_id: string
          related_id: string | null
          related_module: string | null
          severity: string
          target_url: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          read_at?: string | null
          recipient_id: string
          related_id?: string | null
          related_module?: string | null
          severity?: string
          target_url?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          read_at?: string | null
          recipient_id?: string
          related_id?: string | null
          related_module?: string | null
          severity?: string
          target_url?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      page_sections: {
        Row: {
          background_variant:
            | Database["public"]["Enums"]["section_background"]
            | null
          created_at: string
          desktop_visibility: boolean
          display_order: number
          id: string
          internal_label: string
          is_active: boolean
          mobile_visibility: boolean
          page_id: string
          section_key: string
          section_type: string
          updated_at: string
        }
        Insert: {
          background_variant?:
            | Database["public"]["Enums"]["section_background"]
            | null
          created_at?: string
          desktop_visibility?: boolean
          display_order?: number
          id?: string
          internal_label: string
          is_active?: boolean
          mobile_visibility?: boolean
          page_id: string
          section_key: string
          section_type: string
          updated_at?: string
        }
        Update: {
          background_variant?:
            | Database["public"]["Enums"]["section_background"]
            | null
          created_at?: string
          desktop_visibility?: boolean
          display_order?: number
          id?: string
          internal_label?: string
          is_active?: boolean
          mobile_visibility?: boolean
          page_id?: string
          section_key?: string
          section_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "site_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      page_seo: {
        Row: {
          canonical_url: string | null
          description: string | null
          id: string
          no_follow: boolean | null
          no_index: boolean | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          route_path: string
          schema_type: string | null
          sitemap_changefreq: string | null
          sitemap_include: boolean | null
          sitemap_priority: number | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          canonical_url?: string | null
          description?: string | null
          id?: string
          no_follow?: boolean | null
          no_index?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          route_path: string
          schema_type?: string | null
          sitemap_changefreq?: string | null
          sitemap_include?: boolean | null
          sitemap_priority?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          canonical_url?: string | null
          description?: string | null
          id?: string
          no_follow?: boolean | null
          no_index?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          route_path?: string
          schema_type?: string | null
          sitemap_changefreq?: string | null
          sitemap_include?: boolean | null
          sitemap_priority?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          created_at: string | null
          description: string | null
          group_name: string
          id: string
          key: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          group_name: string
          id?: string
          key: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          group_name?: string
          id?: string
          key?: string
        }
        Relationships: []
      }
      portal_announcements: {
        Row: {
          audience: string
          body: string
          created_at: string
          id: string
          is_active: boolean
          published_at: string
          title: string
          updated_at: string
        }
        Insert: {
          audience?: string
          body: string
          created_at?: string
          id?: string
          is_active?: boolean
          published_at?: string
          title: string
          updated_at?: string
        }
        Update: {
          audience?: string
          body?: string
          created_at?: string
          id?: string
          is_active?: boolean
          published_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          price: number | null
          sku: string
          specs: Json
          updated_at: string
        }
        Insert: {
          brand: string
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          price?: number | null
          sku: string
          specs?: Json
          updated_at?: string
        }
        Update: {
          brand?: string
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          price?: number | null
          sku?: string
          specs?: Json
          updated_at?: string
        }
        Relationships: []
      }
      project_references: {
        Row: {
          category: string | null
          client_name: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          logo_url: string | null
          project_date: string | null
          published: boolean
          slug: string
          title: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          category?: string | null
          client_name?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          logo_url?: string | null
          project_date?: string | null
          published?: boolean
          slug: string
          title: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          category?: string | null
          client_name?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          logo_url?: string | null
          project_date?: string | null
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          company: string | null
          company_id: string | null
          contact_name: string
          created_at: string
          email: string
          id: string
          items: Json
          message: string | null
          phone: string | null
          source: string
          status: string
          submitted_by: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company?: string | null
          company_id?: string | null
          contact_name: string
          created_at?: string
          email: string
          id?: string
          items?: Json
          message?: string | null
          phone?: string | null
          source?: string
          status?: string
          submitted_by?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company?: string | null
          company_id?: string | null
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          items?: Json
          message?: string | null
          phone?: string | null
          source?: string
          status?: string
          submitted_by?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      reference_images: {
        Row: {
          alt: string | null
          created_at: string
          display_order: number
          id: string
          reference_id: string
          url: string
        }
        Insert: {
          alt?: string | null
          created_at?: string
          display_order?: number
          id?: string
          reference_id: string
          url: string
        }
        Update: {
          alt?: string | null
          created_at?: string
          display_order?: number
          id?: string
          reference_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "reference_images_reference_id_fkey"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "project_references"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_representatives: {
        Row: {
          code: string
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_active: boolean
          phone: string | null
          region: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          code: string
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          is_active?: boolean
          phone?: string | null
          region?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          region?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      section_content: {
        Row: {
          created_at: string
          display_order: number
          field_key: string
          field_type: string
          id: string
          is_active: boolean
          label: string
          link_url: string | null
          media_url: string | null
          section_id: string
          updated_at: string
          value_json: Json | null
          value_text: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          field_key: string
          field_type: string
          id?: string
          is_active?: boolean
          label: string
          link_url?: string | null
          media_url?: string | null
          section_id: string
          updated_at?: string
          value_json?: Json | null
          value_text?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          field_key?: string
          field_type?: string
          id?: string
          is_active?: boolean
          label?: string
          link_url?: string | null
          media_url?: string | null
          section_id?: string
          updated_at?: string
          value_json?: Json | null
          value_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "section_content_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "page_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_audit_results: {
        Row: {
          affected_route: string | null
          check_type: string
          created_at: string | null
          id: string
          message: string
          status: string
          suggestion: string | null
        }
        Insert: {
          affected_route?: string | null
          check_type: string
          created_at?: string | null
          id?: string
          message: string
          status: string
          suggestion?: string | null
        }
        Update: {
          affected_route?: string | null
          check_type?: string
          created_at?: string | null
          id?: string
          message?: string
          status?: string
          suggestion?: string | null
        }
        Relationships: []
      }
      seo_redirects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          source_path: string
          status_code: number | null
          target_path: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          source_path: string
          status_code?: number | null
          target_path: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          source_path?: string
          status_code?: number | null
          target_path?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      service_images: {
        Row: {
          alt: string | null
          created_at: string
          display_order: number
          id: string
          service_id: string
          url: string
        }
        Insert: {
          alt?: string | null
          created_at?: string
          display_order?: number
          id?: string
          service_id: string
          url: string
        }
        Update: {
          alt?: string | null
          created_at?: string
          display_order?: number
          id?: string
          service_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_images_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          body: string | null
          cover_url: string | null
          created_at: string
          display_order: number
          excerpt: string | null
          icon: string | null
          id: string
          published: boolean
          seo_description: string | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          cover_url?: string | null
          created_at?: string
          display_order?: number
          excerpt?: string | null
          icon?: string | null
          id?: string
          published?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          cover_url?: string | null
          created_at?: string
          display_order?: number
          excerpt?: string | null
          icon?: string | null
          id?: string
          published?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_pages: {
        Row: {
          created_at: string
          id: string
          internal_name: string
          is_indexable: boolean
          route: string
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          internal_name: string
          is_indexable?: boolean
          route: string
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          internal_name?: string
          is_indexable?: boolean
          route?: string
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string | null
          agency_attribution_text: string | null
          agency_attribution_url: string | null
          agency_attribution_visible: boolean | null
          company_name: string
          cookie_policy: string | null
          created_at: string
          description: string | null
          email: string | null
          favicon_url: string | null
          footer_text: string | null
          ga4_active: boolean | null
          ga4_id: string | null
          google_analytics_id: string | null
          google_search_console: string | null
          google_tag_manager_id: string | null
          gtm_active: boolean | null
          hero_cta_primary_text: string | null
          hero_cta_primary_url: string | null
          hero_cta_secondary_text: string | null
          hero_cta_secondary_url: string | null
          hero_description: string | null
          hero_image_url: string | null
          hero_title: string | null
          hero_video_url: string | null
          id: boolean
          is_indexing_enabled: boolean | null
          kvkk_text: string | null
          logo_url: string | null
          map_embed: string | null
          map_url: string | null
          meta_pixel_id: string | null
          mobile_logo_url: string | null
          og_image_default: string | null
          phone: string | null
          privacy_policy: string | null
          robots_txt: string | null
          schema_active: boolean | null
          search_console_method: string | null
          site_url: string | null
          social_facebook: string | null
          social_instagram: string | null
          social_linkedin: string | null
          social_twitter: string | null
          social_youtube: string | null
          tagline: string | null
          terms: string | null
          title_suffix: string | null
          twitter_image_default: string | null
          updated_at: string
          whatsapp: string | null
          working_hours: string | null
        }
        Insert: {
          address?: string | null
          agency_attribution_text?: string | null
          agency_attribution_url?: string | null
          agency_attribution_visible?: boolean | null
          company_name?: string
          cookie_policy?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          favicon_url?: string | null
          footer_text?: string | null
          ga4_active?: boolean | null
          ga4_id?: string | null
          google_analytics_id?: string | null
          google_search_console?: string | null
          google_tag_manager_id?: string | null
          gtm_active?: boolean | null
          hero_cta_primary_text?: string | null
          hero_cta_primary_url?: string | null
          hero_cta_secondary_text?: string | null
          hero_cta_secondary_url?: string | null
          hero_description?: string | null
          hero_image_url?: string | null
          hero_title?: string | null
          hero_video_url?: string | null
          id?: boolean
          is_indexing_enabled?: boolean | null
          kvkk_text?: string | null
          logo_url?: string | null
          map_embed?: string | null
          map_url?: string | null
          meta_pixel_id?: string | null
          mobile_logo_url?: string | null
          og_image_default?: string | null
          phone?: string | null
          privacy_policy?: string | null
          robots_txt?: string | null
          schema_active?: boolean | null
          search_console_method?: string | null
          site_url?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          tagline?: string | null
          terms?: string | null
          title_suffix?: string | null
          twitter_image_default?: string | null
          updated_at?: string
          whatsapp?: string | null
          working_hours?: string | null
        }
        Update: {
          address?: string | null
          agency_attribution_text?: string | null
          agency_attribution_url?: string | null
          agency_attribution_visible?: boolean | null
          company_name?: string
          cookie_policy?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          favicon_url?: string | null
          footer_text?: string | null
          ga4_active?: boolean | null
          ga4_id?: string | null
          google_analytics_id?: string | null
          google_search_console?: string | null
          google_tag_manager_id?: string | null
          gtm_active?: boolean | null
          hero_cta_primary_text?: string | null
          hero_cta_primary_url?: string | null
          hero_cta_secondary_text?: string | null
          hero_cta_secondary_url?: string | null
          hero_description?: string | null
          hero_image_url?: string | null
          hero_title?: string | null
          hero_video_url?: string | null
          id?: boolean
          is_indexing_enabled?: boolean | null
          kvkk_text?: string | null
          logo_url?: string | null
          map_embed?: string | null
          map_url?: string | null
          meta_pixel_id?: string | null
          mobile_logo_url?: string | null
          og_image_default?: string | null
          phone?: string | null
          privacy_policy?: string | null
          robots_txt?: string | null
          schema_active?: boolean | null
          search_console_method?: string | null
          site_url?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          tagline?: string | null
          terms?: string | null
          title_suffix?: string | null
          twitter_image_default?: string | null
          updated_at?: string
          whatsapp?: string | null
          working_hours?: string | null
        }
        Relationships: []
      }
      task_notes: {
        Row: {
          created_at: string | null
          id: string
          note: string
          task_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          note: string
          task_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          note?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_notes_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "admin_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          display_order: number
          email: string | null
          id: string
          linkedin_url: string | null
          name: string
          photo_url: string | null
          published: boolean
          role: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_order?: number
          email?: string | null
          id?: string
          linkedin_url?: string | null
          name: string
          photo_url?: string | null
          published?: boolean
          role?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_order?: number
          email?: string | null
          id?: string
          linkedin_url?: string | null
          name?: string
          photo_url?: string | null
          published?: boolean
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          display_order: number
          id: string
          name: string
          published: boolean
          quote: string
          rating: number | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          display_order?: number
          id?: string
          name: string
          published?: boolean
          quote: string
          rating?: number | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          published?: boolean
          quote?: string
          rating?: number | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
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
      current_company_ids: { Args: { _user_id: string }; Returns: string[] }
      has_company_role: {
        Args: {
          _company_id: string
          _role: Database["public"]["Enums"]["company_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_permission: {
        Args: { _permission_key: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_company_member: {
        Args: { _company_id: string; _user_id: string }
        Returns: boolean
      }
      is_internal_staff: { Args: { _user_id: string }; Returns: boolean }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      address_type: "billing" | "shipping"
      app_role:
        | "admin"
        | "user"
        | "super_admin"
        | "general_manager"
        | "sales_manager"
        | "sales_rep"
        | "finance"
        | "warehouse"
        | "operations"
        | "content_editor"
        | "report_viewer"
        | "seo_manager"
      company_account_status: "active" | "suspended" | "closed" | "pending"
      company_approval_status: "pending" | "approved" | "rejected"
      company_role:
        | "company_admin"
        | "purchasing"
        | "order_creator"
        | "finance_viewer"
        | "viewer"
      company_type:
        | "corporate"
        | "dealer"
        | "distributor"
        | "branch"
        | "end_customer"
      content_status: "draft" | "review" | "published" | "archived"
      risk_status: "low" | "medium" | "high" | "blocked"
      section_background:
        | "navy-950"
        | "navy-900"
        | "navy-800"
        | "light"
        | "yellow"
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
      address_type: ["billing", "shipping"],
      app_role: [
        "admin",
        "user",
        "super_admin",
        "general_manager",
        "sales_manager",
        "sales_rep",
        "finance",
        "warehouse",
        "operations",
        "content_editor",
        "report_viewer",
        "seo_manager",
      ],
      company_account_status: ["active", "suspended", "closed", "pending"],
      company_approval_status: ["pending", "approved", "rejected"],
      company_role: [
        "company_admin",
        "purchasing",
        "order_creator",
        "finance_viewer",
        "viewer",
      ],
      company_type: [
        "corporate",
        "dealer",
        "distributor",
        "branch",
        "end_customer",
      ],
      content_status: ["draft", "review", "published", "archived"],
      risk_status: ["low", "medium", "high", "blocked"],
      section_background: [
        "navy-950",
        "navy-900",
        "navy-800",
        "light",
        "yellow",
      ],
    },
  },
} as const
