import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { EyeIcon, HeartIcon } from 'lucide-react';

import { Snippet } from '@/types/snippet';

interface SnippetGridProps {
  snippets: Snippet[];
}

export function SnippetGrid({ snippets }: SnippetGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {snippets.map((snippet) => (
        <Link key={snippet.id} href={`/snippet/${snippet.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              {snippet.file_url ? (
                <div className="relative aspect-video">
                  <Image
                    src={snippet.file_url}
                    alt={snippet.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Figma Frame</span>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-4">
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 truncate">
                    {snippet.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <div className="flex items-center">
                      <HeartIcon className="w-4 h-4 mr-1" />
                      {snippet.likes_count}
                    </div>
                    <div className="flex items-center">
                      <EyeIcon className="w-4 h-4 mr-1" />
                      {snippet.views_count}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {snippet.users.avatar_url && (
                    <Image
                      src={snippet.users.avatar_url}
                      alt={snippet.users.name}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-500">{snippet.users.name}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {snippet.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
