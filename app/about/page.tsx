import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AffiliationBlock from '@/components/AffiliationBlock';
import { getProfile } from '@/lib/content';

export default function AboutPage() {
  const profile = getProfile();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Navigation />
      <main className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        <h1 className="text-4xl font-bold text-primary mb-2">About</h1>
        <p className="text-gray-600 mb-2">{profile.role}</p>
        <AffiliationBlock className="mb-8" size="compact" />

        <p className="text-gray-700 leading-relaxed">{profile.about}</p>
        <p className="text-gray-700 leading-relaxed mt-4">{profile.postdocSummary}</p>

        <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Education</h2>
        <ul className="space-y-4 text-gray-700 text-sm">
          <li>
            <strong>Post-Doc.</strong> — Hong Kong University of Science and Technology, Hong Kong SAR (Present).
            Supervisor: Chair Prof. Kevin Jing Chen (IEEE Fellow).
          </li>
          <li>
            <strong>Post-Doc.</strong> — Tsinghua University, Beijing, China (2026). Supervisor: Prof. Xiaosen Liu.
          </li>
          <li>
            <strong>Ph.D.</strong> — Hong Kong University of Science and Technology (2023). Electronic & Computer Engineering.
            Supervisor: Prof. Wing-Hung Ki. Thesis: IR-Drop- and Timing-Aware Power Management Techniques for Microprocessors.
          </li>
          <li>
            <strong>B.S.</strong> — Southeast University, Nanjing, China (2018). Electronic Engineering.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Professional Experience</h2>
        <ul className="space-y-3 text-gray-700 text-sm">
          <li>
            <strong>Post-Doctoral Fellow</strong> · 2026–Present · {profile.department}, {profile.affiliation}
            {profile.center ? (
              <>
                <br />
                <span className="text-gray-600">
                  {profile.center}
                  {profile.centerDirector ? ` · Center Director: ${profile.centerDirector}` : ''}
                </span>
              </>
            ) : null}
          </li>
          <li>
            <strong>Post-Doctoral Fellow</strong> · 2023–2026 · School of Integrated Circuits, Tsinghua University
          </li>
          <li>
            <strong>Assistant Research Fellow</strong> · 2023–2026 · School of Integrated Circuits, Tsinghua University
          </li>
          <li>
            <strong>Teaching Assistant</strong> · 2018–2023 · Hong Kong University of Science and Technology
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Honors & Academic Service</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
          {(profile.honors ?? [
            'Beijing Municipal Natural Science Foundation – Youth Fund (Grant No. 4244106), 2023–2025',
            'National Program for Recruiting Overseas Postdoctoral Talent, 2023–2026',
            'Shuimu Tsinghua Scholarship (Global Recruitment), 2023–2026',
          ]).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Selected Achievements</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          {profile.achievements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Contact</h2>
        <div className="bg-white p-5 rounded-lg shadow text-sm text-gray-700 space-y-1">
          <p>
            Email:{' '}
            <a href={`mailto:${profile.email}`} className="text-primary hover:underline">
              {profile.email}
            </a>
          </p>
          <p>Phone: {profile.phone}</p>
          <p>Office: {profile.office}</p>
          <a
            href={profile.cvFile}
            download={profile.cvDownloadName}
            className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition"
          >
            Download CV (PDF)
          </a>
        </div>

        <div className="mt-12">
          <Link href="/" className="text-primary hover:underline">
            ← Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
