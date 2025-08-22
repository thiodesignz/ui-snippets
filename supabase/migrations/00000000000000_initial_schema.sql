-- Create users table
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  name text not null,
  avatar_url text,
  plug_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up row level security for users
alter table public.users enable row level security;
create policy "Users can view all profiles" on public.users
  for select using (true);
create policy "Users can update their own profile" on public.users
  for update using (auth.uid() = id);

-- Create snippets table
create table public.snippets (
  id uuid default extensions.uuid_generate_v4() primary key not null,
  user_id uuid references public.users on delete cascade not null,
  title text not null,
  description text not null,
  tags text[] not null,
  file_url text,
  figma_url text,
  plug_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint "Either file_url or figma_url must be present" check (
    (file_url is not null and figma_url is null) or
    (file_url is null and figma_url is not null)
  )
);

-- Set up row level security for snippets
alter table public.snippets enable row level security;
create policy "Anyone can view snippets" on public.snippets
  for select using (true);
create policy "Authenticated users can create snippets" on public.snippets
  for insert with check (auth.role() = 'authenticated');
create policy "Users can update their own snippets" on public.snippets
  for update using (auth.uid() = user_id);
create policy "Users can delete their own snippets" on public.snippets
  for delete using (auth.uid() = user_id);

-- Create likes table
create table public.likes (
  id uuid default extensions.uuid_generate_v4() primary key not null,
  user_id uuid references public.users on delete cascade not null,
  snippet_id uuid references public.snippets on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, snippet_id)
);

-- Set up row level security for likes
alter table public.likes enable row level security;
create policy "Anyone can view likes" on public.likes
  for select using (true);
create policy "Authenticated users can create likes" on public.likes
  for insert with check (auth.role() = 'authenticated');
create policy "Users can delete their own likes" on public.likes
  for delete using (auth.uid() = user_id);

-- Create views table
create table public.views (
  id uuid default extensions.uuid_generate_v4() primary key not null,
  user_id uuid references public.users on delete cascade,
  snippet_id uuid references public.snippets on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up row level security for views
alter table public.views enable row level security;
create policy "Anyone can view view counts" on public.views
  for select using (true);
create policy "Anyone can create views" on public.views
  for insert with check (true);

-- Create indexes for better performance
create index snippets_user_id_idx on public.snippets(user_id);
create index likes_snippet_id_idx on public.likes(snippet_id);
create index likes_user_id_idx on public.likes(user_id);
create index views_snippet_id_idx on public.views(snippet_id);
create index views_user_id_idx on public.views(user_id);

-- Create functions for full-text search
create extension if not exists pg_trgm;

create function public.search_snippets(search_query text)
returns setof public.snippets
language sql
security definer
set search_path = public
stable
as $$
  select *
  from public.snippets
  where
    to_tsvector('english', title || ' ' || description || ' ' || array_to_string(tags, ' '))
    @@ plainto_tsquery('english', search_query)
  order by created_at desc;
$$;
