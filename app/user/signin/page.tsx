'use client';

import { useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { demoSignIn, signIn } from '@actions/auth/signIn';
import { useToast } from '@hooks/use-toast';
import { useLoadingStore } from '@/lib/zustandStore';

function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleResult = (result: { success: boolean; message: any }) => {
    if (result?.success) {
      toast({
        description: result.message,
      });
      redirect('/');
    } else {
      toast({
        variant: 'destructive',
        description: result.message,
      });
    }
  };

  const handleSubmit = async (formData: FormData) => {
    const { incrementLoading, decrementLoading } = useLoadingStore.getState();

    startTransition(async () => {
      try {
        incrementLoading();
        const result = await signIn(formData);
        handleResult(result);
      } finally {
        decrementLoading();
      }
    });
  };

  const handleDemoLogin = () => {
    const { incrementLoading, decrementLoading } = useLoadingStore.getState();

    startTransition(async () => {
      try {
        incrementLoading();
        const result = await demoSignIn();
        handleResult(result);
      } finally {
        decrementLoading();
      }
    });
  };

  return (
    <div className="w-full pt-8 lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <form action={handleSubmit}>
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                {isPending ? 'Logining...' : 'Login'}
              </Button>
              <Button
                type="button"
                className="w-full"
                onClick={handleDemoLogin}
              >
                {isPending ? 'Logining...' : 'Login with Demo Account'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?
              <Link href="/user/signup" className="underline">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

export default LoginForm;
