import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { LikeButton } from './like-button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { EyeIcon, HeartIcon, Link2Icon, Download } from 'lucide-react';

interface SnippetDetailProps {
  snippet: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    file_url: string | null;
    figma_url: string | null;
    plug_url: string | null;
    users: {
      name: string;
      avatar_url: string | null;
      plug_url: string | null;
    };
    likes_count: number;
    views_count: number;
  };
}

export function SnippetDetail({ snippet }: SnippetDetailProps) {
  const handleDownload = async () => {
    if (!snippet.file_url) return;
    const response = await fetch(snippet.file_url);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${snippet.title}.${blob.type.split('/')[1]}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{snippet.title}</h1>
          <p className="mt-2 text-gray-500">{snippet.description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <LikeButton snippetId={snippet.id} initialLikes={snippet.likes_count} />
          <div className="flex items-center text-gray-500">
            <EyeIcon className="w-4 h-4 mr-1" />
            {snippet.views_count}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {snippet.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
          >
            {tag}
          </span>
        ))}
      </div>

      <Card className="overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-zoom-in relative aspect-[16/9]">
              {snippet.file_url ? (
                <Image
                  src={snippet.file_url}
                  alt={snippet.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <iframe
                  src={snippet.figma_url!}
                  className="w-full h-full"
                  title={snippet.title}
                />
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-screen-lg">
            {snippet.file_url ? (
              <div className="relative aspect-[16/9]">
                <Image
                  src={snippet.file_url}
                  alt={snippet.title}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <iframe
                src={snippet.figma_url!}
                className="w-full aspect-[16/9]"
                title={snippet.title}
              />
            )}
          </DialogContent>
        </Dialog>
      </Card>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-4">
          {snippet.users.avatar_url && (
            <Image
              src={snippet.users.avatar_url}
              alt={snippet.users.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <div>
            <p className="font-medium text-gray-900">{snippet.users.name}</p>
            {snippet.users.plug_url && (
              <Link
                href={snippet.users.plug_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
              >
                <Link2Icon className="w-4 h-4 mr-1" />
                Portfolio
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {snippet.plug_url && (
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link href={snippet.plug_url} target="_blank" rel="noopener noreferrer">
                <Link2Icon className="w-4 h-4 mr-2" />
                View Live
              </Link>
            </Button>
          )}
          {snippet.file_url && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
