import type {
  TaskCategory,
  TaskStatus,
  Recurrence,
  Urgency,
} from "./types";

export interface CategoryMeta {
  id: TaskCategory;
  label: string;
  icon: string;
  blurb: string;
  examples: string;
}

/** The concrete household tasks Task Flow is built to cover. */
export const CATEGORIES: CategoryMeta[] = [
  {
    id: "grocery",
    label: "Grocery Shopping",
    icon: "🛒",
    blurb: "Someone to shop for and deliver your groceries.",
    examples: "Weekly shop, fresh produce, heavy items",
  },
  {
    id: "transport",
    label: "Rides & Transportation",
    icon: "🚗",
    blurb: "A safe ride to appointments, errands or visits.",
    examples: "Doctor visits, pharmacy, church, family",
  },
  {
    id: "repairs",
    label: "Minor Repairs",
    icon: "🔧",
    blurb: "Small fixes around the home, done right.",
    examples: "Leaky faucet, light bulbs, shelves, locks",
  },
  {
    id: "petcare",
    label: "Pet Care",
    icon: "🐾",
    blurb: "Loving care for your pets when you need a hand.",
    examples: "Dog walking, feeding, vet trips",
  },
  {
    id: "housekeeping",
    label: "Housekeeping",
    icon: "🧹",
    blurb: "Light cleaning and tidying to keep things comfortable.",
    examples: "Vacuuming, dishes, laundry, dusting",
  },
  {
    id: "yardwork",
    label: "Yard Work",
    icon: "🌿",
    blurb: "Help keeping the garden and yard in shape.",
    examples: "Mowing, raking, watering, weeding",
  },
  {
    id: "technology",
    label: "Technology Help",
    icon: "💻",
    blurb: "Patient help with phones, computers and TVs.",
    examples: "Video calls, Wi-Fi, printers, apps",
  },
  {
    id: "prescriptions",
    label: "Prescription Pickup",
    icon: "💊",
    blurb: "Pick up and deliver medications on time.",
    examples: "Pharmacy runs, refills, delivery",
  },
  {
    id: "mealprep",
    label: "Meal Preparation",
    icon: "🍲",
    blurb: "A home-cooked meal or prepped food for the week.",
    examples: "Cooking, meal prep, special diets",
  },
  {
    id: "companionship",
    label: "Companionship",
    icon: "🤝",
    blurb: "Friendly company, a chat, or a walk together.",
    examples: "Visits, walks, games, conversation",
  },
];

export function categoryMeta(id: TaskCategory): CategoryMeta {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}

// ---------------------------------------------------------------------------
// Scheduling options — kept plain-language for older users
// ---------------------------------------------------------------------------

export const TIME_WINDOWS = [
  "Early morning (7–9 AM)",
  "Morning (9 AM–12 PM)",
  "Afternoon (12–4 PM)",
  "Evening (4–7 PM)",
  "Anytime that works",
];

export interface RecurrenceMeta {
  id: Recurrence;
  label: string;
  hint: string;
}

export const RECURRENCES: RecurrenceMeta[] = [
  { id: "once", label: "Just once", hint: "A one-time task" },
  { id: "weekly", label: "Every week", hint: "Same day each week" },
  { id: "biweekly", label: "Every 2 weeks", hint: "Twice a month" },
  { id: "monthly", label: "Every month", hint: "Once a month" },
];

export function recurrenceLabel(id: Recurrence): string {
  return RECURRENCES.find((r) => r.id === id)?.label ?? "Just once";
}

export interface UrgencyMeta {
  id: Urgency;
  label: string;
  hint: string;
  className: string;
}

export const URGENCIES: UrgencyMeta[] = [
  {
    id: "flexible",
    label: "I'm flexible",
    hint: "Anytime in the next couple of weeks",
    className: "bg-surface-overlay text-ink-soft",
  },
  {
    id: "soon",
    label: "In the next few days",
    hint: "I'd like this done soon",
    className: "bg-brand-100 text-brand-700",
  },
  {
    id: "urgent",
    label: "As soon as possible",
    hint: "This is urgent",
    className: "bg-warm-100 text-warm-700",
  },
];

export function urgencyMeta(id: Urgency): UrgencyMeta {
  return URGENCIES.find((u) => u.id === id) ?? URGENCIES[0];
}

// ---------------------------------------------------------------------------
// Task status presentation
// ---------------------------------------------------------------------------

export const STATUS_META: Record<
  TaskStatus,
  { label: string; className: string; icon: string; hint: string }
> = {
  open: {
    label: "Finding help",
    className: "bg-brand-100 text-brand-700",
    icon: "🔎",
    hint: "We're finding trusted helpers for you.",
  },
  matched: {
    label: "Helper available",
    className: "bg-verified-100 text-verified-700",
    icon: "✅",
    hint: "A verified helper has confirmed they can help.",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-verified-100 text-verified-700",
    icon: "📅",
    hint: "Your helper and time are confirmed.",
  },
  in_progress: {
    label: "Happening now",
    className: "bg-warm-100 text-warm-700",
    icon: "⏳",
    hint: "Your task is underway.",
  },
  completed: {
    label: "Completed",
    className: "bg-verified-100 text-verified-700",
    icon: "🎉",
    hint: "All done. Thank you!",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-surface-overlay text-ink-muted",
    icon: "—",
    hint: "This task was cancelled.",
  },
};

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

/** Flat, transparent platform fee shown to the user before they pay. */
export const SERVICE_FEE_RATE = 0.1; // 10%

export const PAYMENT_METHODS = [
  "Visa •••• 4242",
  "Mastercard •••• 8210",
  "Bank account •••• 3391",
];
