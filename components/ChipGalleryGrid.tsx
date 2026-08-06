'use client';

import type { ChipItem } from '@/lib/content';

interface ChipGalleryGridProps {
  items: ChipItem[];
  compact?: boolean;
}

export default function ChipGalleryGrid({ items, compact = false }: ChipGalleryGridProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-600">
        Add chip photos to <code>source/chip_gallery/originals/</code>, run{' '}
        <code>npm run chips:thumbs</code>.
      </p>
    );
  }

  return (
    <div className={`grid gap-6 ${compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
      {items.map((item) => (
        <figure key={item.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
          <div className="aspect-video bg-gray-100 relative">
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <figcaption className="p-4">
            <div className="font-semibold text-secondary">{item.title}</div>
            <div className="text-xs text-primary mt-1">{item.subtitle}</div>
            <p className="text-sm text-gray-600 mt-2">{item.caption}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 bg-[#f7fbff] text-primary rounded">
                  {tag}
                </span>
              ))}
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
