// src/infrastructure/auth/SupabaseAuthService.ts

import 'server-only';
import { AuthService, AuthResult } from '@/domain/auth/AuthService';
import { createClientFromCookies } from '@/lib/supabaseClient';
import { injectable } from 'tsyringe';
import { cookies } from 'next/headers';

@injectable()
export class SupabaseAuthService implements AuthService {
  async signIn(
    email: string,
    password: string
  ): Promise<AuthResult<{ userId: string }>> {
    try {
      const supabase = createClientFromCookies(cookies());
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return { success: false, error };
      }
      return { success: true, data: { userId: data.user.id } };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  async signUp(
    email: string,
    password: string
  ): Promise<AuthResult<{ userId: string }>> {
    try {
      const supabase = createClientFromCookies(cookies());
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        return { success: false, error };
      }
      return { success: true, data: { userId: data.user?.id || '' } };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  async getSession(
    supabase = createClientFromCookies(cookies())
  ): Promise<AuthResult<{ userId: string; expiresAt?: Date } | null>> {
    try {
      const { data } = await supabase.auth.getUser();
      const { user } = data;

      if (!user) {
        return { success: true, data: null };
      }

      return {
        success: true,
        data: {
          userId: user.id,
        },
      };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  async signOut(): Promise<AuthResult<void>> {
    try {
      const supabase = createClientFromCookies(cookies());
      await supabase.auth.signOut();
      return { success: true };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
}
