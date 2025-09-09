import { supabase } from './supabaseClient';

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

export async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function upsertProject(project) {
  const row = {
    id: project.id ?? undefined,
    title: project.title || '',
    agent: project.agent || '',
    status: project.status || 'upcoming',
    deadline: project.deadline || null,
    tasks: project.tasks || []
  };
  const { data, error } = await supabase
    .from('projects')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

export async function clearAllProjects() {
  const { error } = await supabase.from('projects').delete().neq('id', -1);
  if (error) throw error;
}

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
