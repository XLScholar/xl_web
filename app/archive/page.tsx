import Navigation from '@/components/Navigation';
import SectionHeader from '@/components/SectionHeader';
import BlogCard from '@/components/BlogCard';
import Footer from '@/components/Footer';
import { getPosts } from '@/lib/content';

export default function ArchivePage() {
  const posts = getPosts();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Navigation />
      <main className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        <SectionHeader
          title="Archive"
          description="Ideas, notes, and longer-form posts."
        />
        <div className="space-y-8">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
