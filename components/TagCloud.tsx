import Link from 'next/link';
import type { Tag } from '@/lib/content';

interface TagCloudProps {
  tags: Tag[];
}

export default function TagCloud({ tags }: TagCloudProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {tags.map((tag) => (
        <Link
          key={tag.slug}
          href={`/tags?tag=${encodeURIComponent(tag.name)}`}
          className="px-4 py-2 bg-[#f7fbff] text-primary rounded-full text-sm font-medium hover:bg-primary hover:text-white transition border border-primary/20"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
}
