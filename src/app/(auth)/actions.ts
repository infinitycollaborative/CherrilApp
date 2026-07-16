"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface AuthState {
  error?: string;
  message?: string;
}

function envReady() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!envReady())
    return { error: "Supabase isn't configured. See .env.example to set it up." };

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("full_name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();

  if (!email || !password || !fullName)
    return { error: "Please enter your name, email and a password." };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone },
    },
  });

  if (error) return { error: error.message };

  // If email confirmation is disabled the user is signed in immediately.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      message:
        "Check your email inbox to confirm your address, then log in to get started.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/onboarding");
}

export async function logIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!envReady())
    return { error: "Supabase isn't configured. See .env.example to set it up." };

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const redirectTo = String(formData.get("redirect") || "") || "/dashboard";

  if (!email || !password)
    return { error: "Please enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!envReady())
    return { error: "Supabase isn't configured. See .env.example to set it up." };

  const email = String(formData.get("email") || "").trim();
  if (!email) return { error: "Enter the email tied to your account." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) return { error: error.message };
  return {
    message: "If that email exists, a password reset link is on its way.",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
