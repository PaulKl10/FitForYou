"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().check(z.minLength(1)),
});

const SignupSchema = z.object({
  email: z.email(),
  password: z.string().check(z.minLength(6), z.maxLength(128)),
  name: z.string().check(z.minLength(1), z.maxLength(100)),
});

const EmailSchema = z.object({
  email: z.email(),
});

const PasswordSchema = z.object({
  password: z.string().check(z.minLength(6), z.maxLength(128)),
});

export async function login(formData: FormData) {
  const supabase = await createClient();

  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Données invalides." };

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const parsed = SignupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
  });
  if (!parsed.success) return { error: "Données invalides." };

  const { email, password, name } = parsed.data;
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    const { prisma } = await import("@/lib/prisma");
    await prisma.profile.create({
      data: {
        userId: data.user.id,
        name,
      },
    });
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();

  const parsed = EmailSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: "Adresse email invalide." };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return { error: "Configuration serveur manquante." };

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const parsed = PasswordSchema.safeParse({ password: formData.get("password") });
  if (!parsed.success) return { error: "Mot de passe invalide (6 caractères minimum)." };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}
