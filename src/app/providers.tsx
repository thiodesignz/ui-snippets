'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Toaster } from 'sonner';
import { type Session } from '@supabase/supabase-js';

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Set up auth listener
  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.access_token !== session?.access_token) {
      router.refresh();
    }
  });

  return (
    <>
      {children}
      <Toaster richColors />
    </>
  );
}
