import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Layout } from '@/components/layout/root-layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'UI Snippets - Share & Discover UI Design Elements',
  description: 'A platform for designers to share and discover UI snippets',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers session={session}>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
