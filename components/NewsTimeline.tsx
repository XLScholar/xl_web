import Link from 'next/link';
import type { NewsItem } from '@/lib/content';

interface NewsTimelineProps {
  items: NewsItem[];
  compact?: boolean;
}

const categoryStyle: Record<string, string> = {
  publication: 'bg-primary/10 text-primary',
  milestone: 'bg-amber-100 text-amber-800',
  research: 'bg-emerald-100 text-emerald-800',
};

export default function NewsTimeline({ items, compact = false }: NewsTimelineProps) {
  return (
    <div className="space-y-6">
      {items.map((item) => (
        <article
          key={item.id}
          className="relative pl-8 pb-2 border-l-2 border-primary/30"
        >
          <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full border-2 border-white" />
          <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-primary">{item.date}</span>
              {item.category && (
                <span
                  className={`text-xs px-2 py-0.5 rounded capitalize ${
                    categoryStyle[item.category] || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {item.category}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
            <p className={`text-gray-700 ${compact ? 'text-sm' : ''}`}>{item.summary}</p>
            {item.tags && item.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags?tag=${encodeURIComponent(tag)}`}
                    className="text-xs px-2 py-1 bg-[#f7fbff] text-primary rounded hover:bg-primary hover:text-white transition"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
