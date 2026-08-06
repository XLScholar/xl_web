import Link from 'next/link';
import Navigation from '@/components/Navigation';
import SectionHeader from '@/components/SectionHeader';
import TagCloud from '@/components/TagCloud';
import BlogCard from '@/components/BlogCard';
import Footer from '@/components/Footer';
import {
  getTags,
  getPosts,
  getNews,
  getPublications,
} from '@/lib/content';

interface TagsPageProps {
  searchParams: { tag?: string };
}

export default function TagsPage({ searchParams }: TagsPageProps) {
  const tags = getTags();
  const selectedTag = searchParams.tag;
  const posts = selectedTag ? getPosts().filter((p) => p.tags.includes(selectedTag)) : [];
  const news = selectedTag ? getNews().filter((n) => n.tags?.includes(selectedTag)) : [];
  const publications = selectedTag
    ? getPublications().filter((p) => p.tags?.includes(selectedTag))
    : [];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Navigation />
      <main className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        <SectionHeader
          title="Tags"
          description="Browse content by research topic."
        />
        <TagCloud tags={tags} />

        {selectedTag && (
          <div className="mt-12 space-y-10">
            <h2 className="text-2xl font-bold text-primary">
              Content tagged &ldquo;{selectedTag}&rdquo;
            </h2>

            {posts.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-secondary mb-4">Posts</h3>
                <div className="grid grid-cols-1 gap-6">
                  {posts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            )}

            {news.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-secondary mb-4">News</h3>
                <ul className="space-y-3">
                  {news.map((item) => (
                    <li key={item.id} className="bg-white p-4 rounded shadow">
                      <div className="text-sm text-primary">{item.date}</div>
                      <div className="font-medium">{item.title}</div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {publications.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-secondary mb-4">Publications</h3>
                <ul className="space-y-3">
                  {publications.map((pub, idx) => (
                    <li key={idx} className="bg-white p-4 rounded shadow">
                      <div className="font-medium text-secondary">{pub.title}</div>
                      <div className="text-sm text-gray-600">{pub.venue}, {pub.year}</div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {posts.length === 0 && news.length === 0 && publications.length === 0 && (
              <p className="text-gray-600">No content found for this tag yet.</p>
            )}
          </div>
        )}

        <div className="mt-12">
          <Link href="/" className="text-primary hover:underline">
            ← Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
