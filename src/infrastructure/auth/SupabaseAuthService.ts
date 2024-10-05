import { AuthService, AuthResult } from '@/domain/auth/AuthService';
import { createClient } from '@/lib/supabaseClient';
import { injectable } from 'tsyringe';

@injectable()
export class SupabaseAuthService implements AuthService {
  async signIn(
    email: string,
    password: string
  ): Promise<AuthResult<{ userId: string }>> {
    try {
      const supabase = createClient();
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
      const supabase = createClient();
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
    const supabase = createClient();
    try {
      const { data } = await supabase.auth.getUser();
      const { user } = data;
      console.log('data:::', data);

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
}
