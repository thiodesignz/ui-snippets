-- Function to get all unique tags
create or replace function get_all_tags()
returns table (tag text)
language plpgsql
as $$
begin
  return query
  select distinct unnest(tags)
  from snippets;
end;
$$;
