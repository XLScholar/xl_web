import type { PhotoItem } from '@/lib/content';

interface PhotoGalleryGridProps {
  items: PhotoItem[];
  compact?: boolean;
  grouped?: boolean;
}

const ALBUM_DESCRIPTIONS: Record<string, string> = {
  "The Sun Never Sets: London's Backlit Majesty": 'Golden backlit evenings across London — where daylight lingers at the horizon.',
  'Echoes of Blue Hours': 'Blue hour — the brief, luminous pause between day and night.',
  'Wanderlust & Pathways': 'Roads and distant horizons — journeys remembered in motion and light.',
};

function sortPhotos(items: PhotoItem[]) {
  return [...items].sort((a, b) => {
    const albumA = 'albumOrder' in a ? (a.albumOrder as number) ?? 99 : 0;
    const albumB = 'albumOrder' in b ? (b.albumOrder as number) ?? 99 : 0;
    if (albumA !== albumB) return albumA - albumB;
    const sortA = 'sortOrder' in a ? (a.sortOrder as number) ?? 0 : 0;
    const sortB = 'sortOrder' in b ? (b.sortOrder as number) ?? 0 : 0;
    return sortA - sortB;
  });
}

function groupByAlbum(items: PhotoItem[]) {
  const standalone = sortPhotos(items.filter((item) => !('album' in item && item.album)));
  const albumMap = new Map<string, PhotoItem[]>();

  items
    .filter((item) => 'album' in item && item.album)
    .forEach((item) => {
      const key = item.album as string;
      const list = albumMap.get(key) ?? [];
      list.push(item);
      albumMap.set(key, list);
    });

  const albums = Array.from(albumMap.entries())
    .map(([name, photos]) => ({
      name,
      photos: sortPhotos(photos),
      order: Math.min(...photos.map((p) => ('albumOrder' in p ? (p.albumOrder as number) : 99))),
    }))
    .sort((a, b) => a.order - b.order);

  return { standalone, albums };
}

function PhotoCard({ item }: { item: PhotoItem }) {
  return (
    <figure className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
      <div className="aspect-[4/3] bg-gray-100">
        <img
          src={item.src}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <figcaption className="p-4 text-sm">
        <div className="font-semibold text-secondary">{item.title}</div>
        {'location' in item && item.location && (
          <div className="text-xs text-primary mt-1">{item.location}</div>
        )}
        {item.caption && <p className="text-gray-600 mt-2 leading-relaxed">{item.caption}</p>}
        {'tags' in item && Array.isArray(item.tags) && item.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {item.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-[#f7fbff] text-primary rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </figcaption>
    </figure>
  );
}

function PhotoGrid({ items, compact }: { items: PhotoItem[]; compact?: boolean }) {
  return (
    <div
      className={`grid gap-6 ${
        compact ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      }`}
    >
      {items.map((item) => (
        <PhotoCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default function PhotoGalleryGrid({
  items,
  compact = false,
  grouped = false,
}: PhotoGalleryGridProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-600">
        Add personal photos to <code>source/photo_gallery/originals/</code>, run{' '}
        <code>npm run photos:thumbs</code>, then update{' '}
        <code>data/photo-gallery.json</code>.
      </p>
    );
  }

  if (!grouped) {
    return <PhotoGrid items={sortPhotos(items)} compact={compact} />;
  }

  const { standalone, albums } = groupByAlbum(items);

  return (
    <div className="space-y-12">
      {standalone.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-primary mb-1">Conference & Milestones</h2>
          <p className="text-sm text-gray-600 mb-5">Academic conferences and doctoral defense.</p>
          <PhotoGrid items={standalone} compact={compact} />
        </section>
      )}

      {albums.map((album) => (
        <section key={album.name}>
          <h2 className="text-xl font-bold text-primary mb-1">{album.name}</h2>
          {ALBUM_DESCRIPTIONS[album.name] && (
            <p className="text-sm text-gray-600 mb-5">{ALBUM_DESCRIPTIONS[album.name]}</p>
          )}
          <PhotoGrid items={album.photos} compact={compact} />
        </section>
      ))}
    </div>
  );
}
