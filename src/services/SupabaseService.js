import { supabase } from '../lib/supabase';

class SupabaseService {
  async saveProfile(profile) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile)
      .select();
    if (error) throw error;
    return data;
  }

  async saveConfig(config, parentId, childId) {
    const { data, error } = await supabase
      .from('app_configs')
      .upsert({
        parent_id: parentId,
        child_id: childId,
        school_year: config.school_year,
        active_subjects: config.active_subjects,
        reward_value_correct: config.reward_value_correct,
        penalty_value_error: config.penalty_value_error
      });
    if (error) throw error;
    return data;
  }

  async recordProgress(childId, contentId, isCorrect, points, monetary) {
    const { data, error } = await supabase
      .from('user_progress')
      .insert({
        child_id: childId,
        content_id: contentId,
        is_correct: isCorrect,
        points_earned: points,
        monetary_earned: monetary
      });
    if (error) throw error;
    return data;
  }

  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  // Verificar se a chave de licença é válida e nunca foi usada
  async checkLicense(key, email) {
    const { data, error } = await supabase.rpc('validate_and_use_license_key', {
      target_key: key,
      user_email: email
    });
    
    if (error) throw error;
    return data; // Retorna true se a chave foi validada e usada, false se for inválida
  }
}

export const supabaseService = new SupabaseService();
