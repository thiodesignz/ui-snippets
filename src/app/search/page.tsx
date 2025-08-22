import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NavBar } from '@/components/nav-bar';
import { SnippetGrid } from '@/components/snippets/snippet-grid';
import { SearchForm } from '@/components/search-form';

interface SearchPageProps {
  searchParams: {
    q?: string;
    tag?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
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

  let snippetsQuery = supabase
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
    `);

  if (searchParams.q) {
    snippetsQuery = snippetsQuery.textSearch('title', searchParams.q);
  }

  if (searchParams.tag) {
    snippetsQuery = snippetsQuery.contains('tags', [searchParams.tag]);
  }

  const { data: snippets } = await snippetsQuery.order('created_at', {
    ascending: false,
  });

  const { data: tags } = await supabase
    .rpc('get_all_tags')
    .order('tag', { ascending: true });

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Snippets</h1>
          <SearchForm initialQuery={searchParams.q} tags={tags || []} />
        </div>

        <SnippetGrid snippets={snippets || []} />
      </main>
    </>
  );
}
