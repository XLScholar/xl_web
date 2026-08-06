import Navigation from '@/components/Navigation';
import SectionHeader from '@/components/SectionHeader';
import ChipGalleryGrid from '@/components/ChipGalleryGrid';
import Footer from '@/components/Footer';
import { getChipGallery } from '@/lib/content';

export default function ChipGalleryPage() {
  const chips = getChipGallery();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Navigation />
      <main className="max-w-6xl mx-auto px-6 pt-28 pb-24">
        <SectionHeader
          title="Chip Gallery"
          description="Tape-out prototypes and measured silicon from PMIC, IVR, and power-converter projects."
        />
        <ChipGalleryGrid items={chips} />
      </main>
      <Footer />
    </div>
  );
}
