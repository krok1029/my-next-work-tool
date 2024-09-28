import { AuthService, AuthResult } from '@/domain/auth/AuthService';
import { supabase } from '@/lib/supabaseClient';
import { injectable } from 'tsyringe';

@injectable()
export class SupabaseAuthService implements AuthService {
  async signIn(
    email: string,
    password: string
  ): Promise<AuthResult<{ userId: string }>> {
    try {
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
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        return { success: false, error };
      }
      return { success: true, data: { userId: data.user?.id || '' } };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  async getSession(): Promise<
    AuthResult<{ userId: string; expiresAt?: Date } | null>
  > {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return { success: true, data: null };
      }

      const { expires_at, user } = session;
      return {
        success: true,
        data: {
          userId: user.id,
          expiresAt: expires_at ? new Date(expires_at * 1000) : undefined,
        },
      };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
}
