import type { Publication } from '@/lib/content';
import { getProfile } from '@/lib/content';

interface PublicationsListProps {
  items: Publication[];
  showFilters?: boolean;
}

export default function PublicationsList({
  items,
  showFilters = false,
}: PublicationsListProps) {
  const profile = getProfile();

  return (
    <div>
      {showFilters && (
        <p className="text-sm text-gray-500 mb-4">
          Filter by type on the full publications section. Selected works below emphasize first-author and high-impact results.
        </p>
      )}
      <div className="space-y-4">
        {items.map((pub, idx) => (
          <article key={idx} className="bg-white p-5 rounded-lg shadow border-l-4 border-primary">
            <div className="flex flex-wrap justify-between gap-2">
              <h3 className="font-semibold text-lg text-secondary">
                {pub.id ? `[${pub.id}] ` : ''}
                {pub.title}
              </h3>
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded h-fit">
                {pub.month ? `${pub.month} ` : ''}
                {pub.year} · {pub.status}
              </span>
            </div>
            <div className="mt-1 text-sm text-gray-700">{pub.authors}</div>
            <div className="mt-2 text-sm text-gray-600 italic">
              {pub.venue}
              {pub.firstAuthor ? ' · First author' : ''}
            </div>
            <div className="mt-3 flex gap-3 flex-wrap">
              {'pdf' in pub && (pub as Publication & { pdf?: string }).pdf && (
                <a
                  className="text-sm text-primary hover:underline"
                  href={(pub as Publication & { pdf?: string }).pdf}
                  target="_blank"
                  rel="noreferrer"
                >
                  PDF
                </a>
              )}
              <a
                className="text-sm text-primary hover:underline"
                href={profile.scholarUrl}
                target="_blank"
                rel="noreferrer"
              >
                Google Scholar
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
