import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import SectionHeader from '@/components/SectionHeader';
import NewsTimeline from '@/components/NewsTimeline';
import TagCloud from '@/components/TagCloud';
import BlogCard from '@/components/BlogCard';
import ResearchAreas from '@/components/ResearchAreas';
import PublicationsList from '@/components/PublicationsList';
import ChipGalleryGrid from '@/components/ChipGalleryGrid';
import PhotoGalleryGrid from '@/components/PhotoGalleryGrid';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  getProfile,
  getNews,
  getTags,
  getPosts,
  getResearch,
  getPublications,
  getChipGallery,
  getPhotoGalleryFeatured,
} from '@/lib/content';

export default function Home() {
  const profile = getProfile();
  const newsPreview = getNews(8);
  const tags = getTags();
  const posts = getPosts(2);
  const research = getResearch();
  const publications = getPublications();
  const chips = getChipGallery();
  const photos = getPhotoGalleryFeatured();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Navigation />
      <Hero />

      <main className="max-w-6xl mx-auto px-6 pb-24">
        <section id="news" className="py-12">
          <SectionHeader
            title="Timeline"
            description="All publications, research interests, and career milestones from the CV."
            viewAllHref="/news"
            viewAllLabel="Full timeline"
          />
          <NewsTimeline items={newsPreview} compact />
          <div className="mt-6 text-center">
            <Link href="/news" className="text-primary font-medium hover:underline">
              View full timeline ({getNews().length} entries) →
            </Link>
          </div>
        </section>

        <section id="tags" className="py-12">
          <SectionHeader
            title="Research Tags"
            description="Topics from the CV research interests and publications."
            viewAllHref="/tags"
          />
          <TagCloud tags={tags} />
        </section>

        <section id="chips" className="py-12">
          <SectionHeader
            title="Chip Gallery"
            description="Technical appendix figures — JSSC [J2, J3], ESSERC [C1, C2], CICC [C8], and TCAS-I [J1]."
            viewAllHref="/gallery/chips"
          />
          <ChipGalleryGrid items={chips} compact />
        </section>

        <section id="photos" className="py-12">
          <SectionHeader
            title="Photos"
            description="Conference milestones and travel albums — The Sun Never Sets, Echoes of Blue Hours, Wanderlust & Pathways."
            viewAllHref="/gallery/photos"
          />
          <PhotoGalleryGrid items={photos} compact />
        </section>

        <section id="archive" className="py-12">
          <SectionHeader
            title="Notes"
            description="CV-derived academic achievement summary."
            viewAllHref="/archive"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        <section id="research" className="py-12">
          <SectionHeader title="Research Interests" />
          <ResearchAreas areas={research} mainline={profile.researchMainline} />
          <details className="mt-6 bg-white p-4 rounded-lg shadow">
            <summary className="cursor-pointer font-medium">Selected Academic Achievements</summary>
            <ul className="mt-3 text-gray-700 space-y-2 list-disc list-inside text-sm">
              {profile.achievements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>
        </section>

        <section id="publications" className="py-12">
          <SectionHeader
            title="Publications"
            description="Complete list from CV — conference papers [C1]–[C26] and journal papers [J1]–[J3]."
            viewAllHref={profile.scholarUrl}
            viewAllLabel="Google Scholar"
          />
          <PublicationsList items={publications} />
        </section>

        <section id="contact" className="py-12">
          <SectionHeader title="Contact" />
          <div className="bg-white p-6 rounded-lg shadow space-y-2 text-gray-700">
            <p>
              Email:{' '}
              <a href={`mailto:${profile.email}`} className="text-primary hover:underline">
                {profile.email}
              </a>
            </p>
            <p>Phone: {profile.phone}</p>
            <p>Office: {profile.office}</p>
            <p className="mt-3">{profile.openTo}</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
