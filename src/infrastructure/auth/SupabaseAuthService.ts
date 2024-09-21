// src/infrastructure/auth/SupabaseAuthService.ts
import { AuthService } from '@/domain/auth/AuthService';
import { supabase } from '@/lib/supabaseClient';
import { injectable } from 'tsyringe';

@injectable()
export class SupabaseAuthService implements AuthService {
  async signIn(email: string, password: string) {
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { user, error };
  }

  async signUp(email: string, password: string) {
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    return { user, error };
  }
}
