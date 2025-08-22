import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  tags: z.string().transform((str) => str.split(',').map((s) => s.trim())),
  plugUrl: z.string().url().optional(),
  file: z.instanceof(File).optional(),
  figmaUrl: z.string().url().optional(),
}).refine((data) => data.file || data.figmaUrl, {
  message: 'Either a file or Figma URL is required',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UploadFormProps {
  user: User;
}

export function UploadForm({ user }: UploadFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: '',
      plugUrl: '',
      figmaUrl: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      let fileUrl = null;
      if (values.file) {
        const fileExt = values.file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('snippets')
          .upload(fileName, values.file);

        if (uploadError) throw uploadError;
        fileUrl = data.path;
      }

      const { error } = await supabase.from('snippets').insert({
        user_id: user.id,
        title: values.title,
        description: values.description,
        tags: values.tags,
        plug_url: values.plugUrl,
        file_url: fileUrl,
        figma_url: values.figmaUrl,
      });

      if (error) throw error;

      toast.success('Snippet uploaded successfully!');
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a title for your snippet" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Describe your UI snippet"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter tags separated by commas"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Example: dashboard, dark-mode, mobile
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="plugUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plug URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://your-portfolio.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Link to your portfolio or the live version of this UI
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div>
            <FormLabel>Upload Method</FormLabel>
            <FormDescription>
              Choose either file upload or Figma URL
            </FormDescription>
          </div>

          <FormField
            control={form.control}
            name="file"
            render={({ field: { value, ...field } }) => (
              <FormItem>
                <FormLabel>File Upload</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      field.onChange(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </FormControl>
                <FormDescription>
                  Upload a PNG, JPG, or SVG file
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="figmaUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Figma URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://www.figma.com/file/..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Paste a Figma share link
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Upload Snippet'}
        </Button>
      </form>
    </Form>
  );
}
