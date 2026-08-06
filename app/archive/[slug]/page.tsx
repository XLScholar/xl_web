import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getPostBySlug, getPosts } from '@/lib/content';

interface PostPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Navigation />
      <main className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        <div className="text-sm text-gray-500 mb-4 flex flex-wrap gap-2">
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.category}</span>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
        <h1 className="text-4xl font-bold text-primary mb-6">{post.title}</h1>
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags?tag=${encodeURIComponent(tag)}`}
              className="text-xs px-2 py-1 bg-[#f7fbff] text-primary rounded"
            >
              {tag}
            </Link>
          ))}
        </div>
        <article className="prose prose-gray max-w-none whitespace-pre-line text-gray-700 leading-relaxed">
          {post.content}
        </article>
        <div className="mt-12">
          <Link href="/archive" className="text-primary hover:underline">
            ← Back to archive
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
