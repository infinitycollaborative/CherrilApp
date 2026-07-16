// ---------------------------------------------------------------------------
// Task Flow domain types
// ---------------------------------------------------------------------------

export type UserRole = "member" | "admin";
export type UserStatus = "active" | "suspended";

/** The two sides of the marketplace. Seniors are the primary users. */
export type AccountType = "senior" | "tasker";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  account_type: AccountType;
  avatar_url: string | null;
  role: UserRole;
  status: UserStatus;
  onboarding_completed: boolean;
  emergency_contact: string | null;
  notify_sms: boolean;
  notify_email: boolean;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Task categories & requests
// ---------------------------------------------------------------------------

export type TaskCategory =
  | "grocery"
  | "repairs"
  | "petcare"
  | "transport"
  | "housekeeping"
  | "yardwork"
  | "technology"
  | "companionship"
  | "mealprep"
  | "prescriptions";

export type Recurrence = "once" | "weekly" | "biweekly" | "monthly";
export type Urgency = "flexible" | "soon" | "urgent";

export type TaskStatus =
  | "open" // posted, looking for a helper
  | "matched" // a tasker has confirmed availability
  | "scheduled" // helper assigned & date confirmed
  | "in_progress" // happening now
  | "completed" // done, awaiting/settled payment
  | "cancelled";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  category: TaskCategory;
  description: string | null;
  location: string | null;
  scheduled_date: string | null; // yyyy-mm-dd
  scheduled_time: string | null; // free text e.g. "Morning (9–12)"
  recurrence: Recurrence;
  urgency: Urgency;
  budget: number | null; // offered budget in USD
  status: TaskStatus;
  tasker_id: string | null;
  created_at: string;
  updated_at: string;
}

/** A task joined with its assigned tasker (for detail views). */
export interface TaskWithTasker extends Task {
  tasker?: Tasker | null;
}

// ---------------------------------------------------------------------------
// Verified tasker network
// ---------------------------------------------------------------------------

export interface Tasker {
  id: string;
  name: string;
  headline: string; // short tagline
  bio: string;
  emoji: string; // friendly avatar stand-in
  city: string;
  skills: TaskCategory[];
  hourly_rate: number;
  rating: number; // 0–5
  reviews_count: number;
  tasks_completed: number;
  years_experience: number;
  background_checked: boolean;
  identity_verified: boolean;
  references_count: number;
  response_time: string; // e.g. "Usually replies within 1 hour"
  languages: string[];
  created_at: string;
}

// ---------------------------------------------------------------------------
// In-app messaging
// ---------------------------------------------------------------------------

export type MessageSender = "senior" | "tasker" | "system";

export interface TaskMessage {
  id: string;
  task_id: string;
  user_id: string;
  sender: MessageSender;
  body: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Secure payments
// ---------------------------------------------------------------------------

export type PaymentStatus = "pending" | "held" | "released" | "refunded";

export interface Payment {
  id: string;
  task_id: string;
  user_id: string;
  tasker_id: string | null;
  amount: number;
  service_fee: number;
  status: PaymentStatus;
  method: string | null; // e.g. "Visa •••• 4242"
  created_at: string;
  updated_at: string;
}
