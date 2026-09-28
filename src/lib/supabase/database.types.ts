type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<
        {
          id: string;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id: string;
          display_name?: string | null;
        }
      >;
      goals: Table<
        {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          category: string;
          target_amount: number;
          target_date: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          user_id?: string;
          name: string;
          description?: string | null;
          category: string;
          target_amount: number;
          target_date?: string | null;
        }
      >;
      goal_contributions: Table<
        {
          id: string;
          user_id: string;
          goal_id: string;
          amount: number;
          noted_on: string;
          note: string | null;
          created_at: string;
        },
        {
          id?: string;
          user_id?: string;
          goal_id: string;
          amount: number;
          noted_on?: string;
          note?: string | null;
        }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
