import Navigation from '@/components/Navigation';
import SectionHeader from '@/components/SectionHeader';
import NewsTimeline from '@/components/NewsTimeline';
import Footer from '@/components/Footer';
import { getNews } from '@/lib/content';

export default function NewsPage() {
  const news = getNews();
  const pubs = news.filter((n) => n.category === 'publication').length;
  const milestones = news.filter((n) => n.category === 'milestone').length;
  const research = news.filter((n) => n.category === 'research').length;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Navigation />
      <main className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        <SectionHeader
          title="Full Timeline"
          description={`All entries from the CV: ${pubs} publications · ${research} research interests · ${milestones} career/education milestones.`}
        />
        <div className="mb-8 flex flex-wrap gap-3 text-sm">
          <span className="px-3 py-1 rounded bg-primary/10 text-primary">{pubs} Publications</span>
          <span className="px-3 py-1 rounded bg-emerald-100 text-emerald-800">{research} Research interests</span>
          <span className="px-3 py-1 rounded bg-amber-100 text-amber-800">{milestones} Milestones</span>
        </div>
        <NewsTimeline items={news} />
      </main>
      <Footer />
    </div>
  );
}
