'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { HeartIcon } from 'lucide-react';
import { toast } from 'sonner';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LikeButtonProps {
  snippetId: string;
  initialLikes: number;
}

export function LikeButton({ snippetId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    try {
      setIsLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error('Please sign in to like snippets');
        return;
      }

      const { error } = await supabase.from('likes').insert({
        snippet_id: snippetId,
        user_id: session.user.id,
      });

      if (error) {
        if (error.code === '23505') {
          // Unique violation - user already liked
          toast.error('You have already liked this snippet');
        } else {
          throw error;
        }
        return;
      }

      setLikes((prev) => prev + 1);
      toast.success('Snippet liked!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLike}
      disabled={isLoading}
      className="flex items-center space-x-1"
    >
      <HeartIcon className="w-4 h-4" />
      <span>{likes}</span>
    </Button>
  );
}
