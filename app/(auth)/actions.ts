"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db/db";
import { profiles } from "@/lib/db/schema";

export async function login(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/organizations");
}

export async function signup(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    try {
      await db.insert(profiles).values({
        userId: data.user.id,
        email: data.user.email ?? email,
      });
    } catch {
      return { error: "Account created but profile setup failed. Please contact support." };
    }
  }

  return { error: null };
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error.message);
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

export async function forgotPassword(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function resetPassword(code: string, newPassword: string) {
  const supabase = await createClient();

  const { error: verifyError } = await supabase.auth.exchangeCodeForSession(code);

  if (verifyError) {
    return { error: verifyError.message };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
