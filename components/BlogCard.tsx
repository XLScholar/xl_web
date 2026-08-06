import Link from 'next/link';
import type { Post } from '@/lib/content';

interface BlogCardProps {
  post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
      <div className="flex items-center gap-2 mb-3 text-sm text-gray-500 flex-wrap">
        <span>{post.date}</span>
        <span className="text-gray-300">·</span>
        <span className="text-primary/80">{post.category}</span>
        <span className="text-gray-300">·</span>
        <span>{post.readingTime}</span>
      </div>
      <div className="flex gap-2 flex-wrap mb-3">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 bg-[#f7fbff] text-primary rounded"
          >
            {tag}
          </span>
        ))}
      </div>
      <h3 className="text-xl font-semibold text-secondary mb-2 hover:text-primary">
        <Link href={`/archive/${post.slug}`} className="hover:underline">
          {post.title}
        </Link>
      </h3>
      <p className="text-gray-700 text-sm mb-4">{post.excerpt}</p>
      <Link
        href={`/archive/${post.slug}`}
        className="text-sm text-primary hover:underline font-medium"
      >
        Read more →
      </Link>
    </article>
  );
}
