import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getProfile, getPublications } from '@/lib/content';

export default function CVPage() {
  const profile = getProfile();
  const pubs = getPublications();
  const conferences = pubs.filter((p) => p.type === 'conference');
  const journals = pubs.filter((p) => p.type === 'journal');

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Navigation />
      <main className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        <h1 className="text-4xl font-bold text-primary mb-4">Curriculum Vitae</h1>
        <p className="text-gray-600 mb-8">
          Content synchronized from <em>Xuliang_Wang_CV_Oct_2026.pdf</em> (last updated {profile.lastUpdated}).
        </p>

        <a
          href={profile.cvFile}
          download={profile.cvDownloadName}
          className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white rounded hover:bg-secondary transition mb-10"
        >
          Download Full CV (PDF)
        </a>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow text-gray-700 mb-10">
          <section>
            <h2 className="text-xl font-semibold text-primary mb-4 border-b-2 border-primary pb-2">
              Education
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <div className="font-semibold">Post-Doc., Tsinghua University</div>
                <div className="text-gray-600">2026 · Supervisor: Prof. Xiaosen Liu</div>
              </div>
              <div>
                <div className="font-semibold">Ph.D., HKUST</div>
                <div className="text-gray-600">
                  2023 · ECE · Prof. Wing-Hung Ki · Thesis: IR-Drop- and Timing-Aware Power Management
                  Techniques for Microprocessors
                </div>
              </div>
              <div>
                <div className="font-semibold">B.S., Southeast University</div>
                <div className="text-gray-600">2018 · Electronic Engineering</div>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mb-4 border-b-2 border-primary pb-2">
              Honors
            </h2>
            <ul className="text-sm space-y-2 list-disc list-inside">
              {(profile.honors ?? []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4 border-b-2 border-primary pb-2">
              Experience
            </h2>
            <ul className="text-sm space-y-2">
              <li>Post-Doctoral Fellow, Tsinghua, 2023–present</li>
              <li>Assistant Research Fellow, Tsinghua, 2023–present</li>
              <li>Teaching Assistant, HKUST, 2018–2023</li>
            </ul>
          </section>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-2">
            Publications on this site
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {conferences.length} conference papers · {journals.length} journal papers (full titles on the homepage
            Publications section and Timeline).
          </p>
          <Link href="/#publications" className="text-primary hover:underline text-sm">
            Jump to publications →
          </Link>
          {' · '}
          <Link href="/news" className="text-primary hover:underline text-sm">
            Full timeline →
          </Link>
        </section>

        <div className="mt-8">
          <Link href="/" className="text-primary hover:underline">
            ← Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
