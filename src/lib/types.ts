export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  invite_code: string;
  partner_id: string | null;
  together_since: string | null;
  days_together: number;
  created_at: string;
  updated_at: string;
}

export interface Mood {
  id: string;
  user_id: string;
  mood: "Feliz" | "Cansado" | "Enojado" | "Enamorado" | "Triste" | "Emocionado";
  emoji: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  location: string | null;
  created_by: string;
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  title: string;
  description: string | null;
  items: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  color: string;
  created_by: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface MissYouLog {
  id: string;
  sender_id: string;
  receiver_id: string | null;
  message: string | null;
  created_at: string;
}

export interface Partner {
  id: string;
  user_id_1: string;
  user_id_2: string;
  status: "accepted" | "rejected" | "pending";
  created_at: string;
  updated_at: string;
}
