// src/components/remoteProjects.jsx
import { supabase } from './supabaseClient';

/* ----------------- Auth helpers ----------------- */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user ?? null;
}

export function signInWithEmail(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

export function signUpWithEmail(email, password) {
  return supabase.auth.signUp({ email, password });
}

export function signOut() {
  return supabase.auth.signOut();
}

/* ----------------- Projects (RLS-safe) ----------------- */

/**
 * Read current user's projects (RLS restricts to owner automatically).
 */
export async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Create OR update a project.
 * - For inserts we DO NOT send `id` or `user_id` so the DB sets user_id = auth.uid().
 * - For updates we only send editable fields and filter by id (RLS ensures ownership).
 */
export async function upsertProject(project) {
  const clean = {
    title: project.title || '',
    agent: project.agent || '',
    status: project.status || 'upcoming',
    deadline: project.deadline || null,
    tasks: Array.isArray(project.tasks) ? project.tasks : []
  };

  if (project.id) {
    // UPDATE existing row (RLS: only your own row will be updatable)
    const { data, error } = await supabase
      .from('projects')
      .update(clean)
      .eq('id', project.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // INSERT new row (RLS: with-check + DEFAULT user_id = auth.uid())
    const { data, error } = await supabase
      .from('projects')
      .insert(clean)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

/**
 * Delete a single project by id (RLS ensures you can delete only your own).
 */
export async function deleteProject(id) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Delete ALL of the current user's projects.
 * RLS automatically scopes this to the authenticated user,
 * so no need for an extra filter like `neq('id', -1)`.
 */
export async function clearAllProjects() {
  const { error } = await supabase
    .from('projects')
    .delete();

  if (error) throw error;
}

/**
 * Realtime subscription to any change in the projects table.
 * Returns an unsubscribe function.
 */
export function subscribeProjects(onChange) {
  const channel = supabase
    .channel('projects-feed')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'projects' },
      () => onChange && onChange()
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
