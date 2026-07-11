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
          contact_name: string
          created_at: string
          email: string
          id: string
          items: Json
          message: string | null
          phone: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company?: string | null
          contact_name: string
          created_at?: string
          email: string
          id?: string
          items?: Json
          message?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company?: string | null
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          items?: Json
          message?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
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
      site_settings: {
        Row: {
          address: string | null
          company_name: string
          cookie_policy: string | null
          created_at: string
          description: string | null
          email: string | null
          favicon_url: string | null
          footer_text: string | null
          google_analytics_id: string | null
          google_search_console: string | null
          hero_cta_primary_text: string | null
          hero_cta_primary_url: string | null
          hero_cta_secondary_text: string | null
          hero_cta_secondary_url: string | null
          hero_description: string | null
          hero_image_url: string | null
          hero_title: string | null
          hero_video_url: string | null
          id: boolean
          kvkk_text: string | null
          logo_url: string | null
          map_embed: string | null
          map_url: string | null
          meta_pixel_id: string | null
          mobile_logo_url: string | null
          phone: string | null
          privacy_policy: string | null
          social_facebook: string | null
          social_instagram: string | null
          social_linkedin: string | null
          social_twitter: string | null
          social_youtube: string | null
          tagline: string | null
          terms: string | null
          updated_at: string
          whatsapp: string | null
          working_hours: string | null
        }
        Insert: {
          address?: string | null
          company_name?: string
          cookie_policy?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          favicon_url?: string | null
          footer_text?: string | null
          google_analytics_id?: string | null
          google_search_console?: string | null
          hero_cta_primary_text?: string | null
          hero_cta_primary_url?: string | null
          hero_cta_secondary_text?: string | null
          hero_cta_secondary_url?: string | null
          hero_description?: string | null
          hero_image_url?: string | null
          hero_title?: string | null
          hero_video_url?: string | null
          id?: boolean
          kvkk_text?: string | null
          logo_url?: string | null
          map_embed?: string | null
          map_url?: string | null
          meta_pixel_id?: string | null
          mobile_logo_url?: string | null
          phone?: string | null
          privacy_policy?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          tagline?: string | null
          terms?: string | null
          updated_at?: string
          whatsapp?: string | null
          working_hours?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string
          cookie_policy?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          favicon_url?: string | null
          footer_text?: string | null
          google_analytics_id?: string | null
          google_search_console?: string | null
          hero_cta_primary_text?: string | null
          hero_cta_primary_url?: string | null
          hero_cta_secondary_text?: string | null
          hero_cta_secondary_url?: string | null
          hero_description?: string | null
          hero_image_url?: string | null
          hero_title?: string | null
          hero_video_url?: string | null
          id?: boolean
          kvkk_text?: string | null
          logo_url?: string | null
          map_embed?: string | null
          map_url?: string | null
          meta_pixel_id?: string | null
          mobile_logo_url?: string | null
          phone?: string | null
          privacy_policy?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          tagline?: string | null
          terms?: string | null
          updated_at?: string
          whatsapp?: string | null
          working_hours?: string | null
        }
        Relationships: []
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
      risk_status: "low" | "medium" | "high" | "blocked"
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
      risk_status: ["low", "medium", "high", "blocked"],
    },
  },
} as const
