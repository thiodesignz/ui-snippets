export interface Snippet {
  id: string;
  title: string;
  file_url: string | null;
  figma_url: string | null;
  tags: string[];
  users: {
    name: string;
    avatar_url: string | null;
  };
  likes_count: number;
  views_count: number;
}

export interface SnippetInput extends Omit<Snippet, 'id' | 'users' | 'likes_count' | 'views_count'> {
  user_id: string;
}
