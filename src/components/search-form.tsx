'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';

const formSchema = z.object({
  q: z.string().optional(),
  tag: z.string().optional(),
});

interface SearchFormProps {
  initialQuery?: string;
  tags: string[];
}

export function SearchForm({ initialQuery = '', tags }: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      q: initialQuery,
      tag: searchParams.get('tag') || '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const params = new URLSearchParams();
    if (values.q) params.set('q', values.q);
    if (values.tag) params.set('tag', values.tag);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="q"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      placeholder="Search snippets..."
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 py-2"
                    {...field}
                  >
                    <option value="">All Tags</option>
                    {tags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Search</Button>
        </div>
      </form>
    </Form>
  );
}
