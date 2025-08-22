import { SnippetGrid } from '@/components/snippets/snippet-grid';
import { Snippet } from '@/types/snippet';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
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

  const { data: featuredSnippets } = await supabase
    .from('snippets')
    .select(`
      id,
      title,
      file_url,
      figma_url,
      tags,
      users (
        name,
        avatar_url
      ),
      likes_count:likes(count),
      views_count:views(count)
    `)
    .returns<Snippet[]>()
    .order('created_at', { ascending: false })
    .limit(6);

  return (
    <div className="container px-4 md:px-6 py-6 md:py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Discover & Share UI Snippets
        </h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          A community platform for designers to share and discover beautiful UI elements.
          Upload your work or explore snippets from other creators.
        </p>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Featured Snippets</h2>
        </div>
        <SnippetGrid snippets={featuredSnippets || []} />
      </div>
    </div>
  );
}
