import Link from 'next/link';
import type { ResearchArea } from '@/lib/content';

interface ResearchAreasProps {
  areas: ResearchArea[];
  mainline: string;
}

export default function ResearchAreas({ areas, mainline }: ResearchAreasProps) {
  return (
    <div>
      <p className="text-gray-700">
        Core research line: <strong>{mainline}</strong>
      </p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {areas.map((area) => (
          <div
            key={area.id}
            className="p-5 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="text-xs uppercase tracking-wide text-primary/70 mb-1">
              {area.level}
            </div>
            <h4 className="font-semibold text-secondary">{area.title}</h4>
            <p className="mt-2 text-gray-700 text-sm">{area.summary}</p>
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-primary hover:text-secondary font-medium">
                View details & related work →
              </summary>
              <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-700 space-y-3">
                <p>
                  <strong>Research Focus:</strong> {area.focus}
                </p>
                <div>
                  <strong>Key Contributions:</strong>
                  <ul className="list-disc list-inside ml-2 space-y-1 mt-1">
                    {area.contributions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Related Publications:</strong>
                  <ul className="list-disc list-inside ml-2 space-y-1 mt-1">
                    {area.relatedPublications.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2">
                  {area.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags?tag=${encodeURIComponent(tag)}`}
                      className="text-xs px-2 py-1 bg-[#f7fbff] text-primary rounded"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
