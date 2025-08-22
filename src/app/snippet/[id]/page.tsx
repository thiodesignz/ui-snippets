import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { SnippetDetail } from '@/components/snippets/snippet-detail';
import { NavBar } from '@/components/nav-bar';

interface SnippetPageProps {
  params: {
    id: string;
  };
}

export default async function SnippetPage({ params }: SnippetPageProps) {
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

  const { data: snippet } = await supabase
    .from('snippets')
    .select(`
      *,
      users (
        name,
        avatar_url,
        plug_url
      ),
      (
        select count(*) from likes where snippet_id = snippets.id
      ) as likes_count,
      (
        select count(*) from views where snippet_id = snippets.id
      ) as views_count
    `)
    .eq('id', params.id)
    .single();

  if (!snippet) {
    notFound();
  }

  // Record view
  await supabase.from('views').insert({
    snippet_id: snippet.id,
    user_id: null, // Anonymous view
  });

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <SnippetDetail snippet={snippet} />
      </main>
    </>
  );
}
