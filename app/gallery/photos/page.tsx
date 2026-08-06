import Navigation from '@/components/Navigation';
import SectionHeader from '@/components/SectionHeader';
import PhotoGalleryGrid from '@/components/PhotoGalleryGrid';
import Footer from '@/components/Footer';
import { getPhotoGallery } from '@/lib/content';

export default function PhotoGalleryPage() {
  const photos = getPhotoGallery();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Navigation />
      <main className="max-w-6xl mx-auto px-6 pt-28 pb-24">
        <SectionHeader
          title="Photo Gallery"
          description="Conference milestones and personal travel albums."
        />
        <PhotoGalleryGrid items={photos} grouped />
      </main>
      <Footer />
    </div>
  );
}
