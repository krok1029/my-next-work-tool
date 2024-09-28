// src/infrastructure/auth/SupabaseAuthService.ts
import { AuthService } from '@/domain/auth/AuthService';
import { supabase } from '@/lib/supabaseClient';
import { injectable } from 'tsyringe';

@injectable()
export class SupabaseAuthService implements AuthService {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { user: null, error };
    }
    return { user: data.user.id, error };
  }

  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { user: null, error };
    }
    return { user: data.user?.id || '', error };
  }

  async getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return { session };
  }
}
