import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { NavBar } from '@/components/nav-bar';
import { SnippetGrid } from '@/components/snippets/snippet-grid';
import { Link2Icon } from 'lucide-react';
import Link from 'next/link';

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
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

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!user) {
    notFound();
  }

  const { data: snippets } = await supabase
    .from('snippets')
    .select(`
      *,
      users (
        name,
        avatar_url
      ),
      (
        select count(*) from likes where snippet_id = snippets.id
      ) as likes_count,
      (
        select count(*) from views where snippet_id = snippets.id
      ) as views_count
    `)
    .eq('user_id', params.id)
    .order('created_at', { ascending: false });

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            {user.avatar_url && (
              <Image
                src={user.avatar_url}
                alt={user.name}
                width={80}
                height={80}
                className="rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              {user.plug_url && (
                <Link
                  href={user.plug_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 flex items-center mt-1"
                >
                  <Link2Icon className="w-4 h-4 mr-1" />
                  {user.plug_url}
                </Link>
              )}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Uploaded Snippets</h2>
        <SnippetGrid snippets={snippets || []} />
      </main>
    </>
  );
}
