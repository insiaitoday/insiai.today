'use client';
import { supabase } from './supabase';

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    window.location.href = '/login';
    return null;
  }
  // Persist token for API calls
  localStorage.setItem('insiai_admin_session', JSON.stringify(session));
  return session;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (data.session) {
    localStorage.setItem('insiai_admin_session', JSON.stringify(data.session));
  }
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
  localStorage.removeItem('insiai_admin_session');
  window.location.href = '/login';
}
