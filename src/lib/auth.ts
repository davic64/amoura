import { supabase } from "./supabase";

export interface AuthError {
  message: string;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw { message: error.message };
  }

  return data;
}

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    throw { message: error.message };
  }

  if (data.session) {
    return data;
  }

  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (signInError) {
    throw { message: signInError.message };
  }

  return signInData;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw { message: error.message };
  }
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
}

export async function onAuthStateChange(
  callback: (
    event: string,
    session: import("@supabase/supabase-js").Session | null,
  ) => void,
) {
  return supabase.auth.onAuthStateChange(callback);
}
