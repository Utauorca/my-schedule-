import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppState, UserSettings } from '../types';

let supabase: SupabaseClient | null = null;

export const initSupabase = (settings: UserSettings): boolean => {
  if (!settings.supabaseUrl || !settings.supabaseKey) return false;
  try {
    supabase = createClient(settings.supabaseUrl, settings.supabaseKey);
    return true;
  } catch (e) {
    console.error("Failed to init supabase", e);
    return false;
  }
};

export const saveToCloud = async (settings: UserSettings, data: AppState) => {
  if (!supabase) {
    if (!initSupabase(settings)) throw new Error("尚未設定雲端連線");
  }

  const { error } = await supabase!
    .from('user_data')
    .upsert({ 
      id: settings.syncId, 
      content: data,
      updated_at: new Date().toISOString()
    });

  if (error) {
    throw new Error(`上傳失敗: ${error.message}`);
  }
};

export const loadFromCloud = async (settings: UserSettings): Promise<AppState | null> => {
  if (!supabase) {
    if (!initSupabase(settings)) throw new Error("尚未設定雲端連線");
  }

  const { data, error } = await supabase!
    .from('user_data')
    .select('content')
    .eq('id', settings.syncId)
    .single();

  if (error) {
    // If code is PGRST116, it means no rows found, which is fine for first sync
    if (error.code === 'PGRST116') return null;
    throw new Error(`下載失敗: ${error.message}`);
  }

  return data?.content as AppState;
};
