import Link from 'next/link';
import { getProfile } from '@/lib/content';
import AffiliationBlock from '@/components/AffiliationBlock';

export default function Hero() {
  const profile = getProfile();

  return (
    <section
      id="hero"
      className="pt-28 pb-20 bg-gradient-to-br from-primary/5 to-primary/10"
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-2/3">
          <p className="text-sm text-secondary font-medium mb-2">
            Hello! I am {profile.name}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
            {profile.name}, {profile.title}
          </h1>
            <p className="mt-3 text-lg text-secondary font-medium">
              {profile.role}
            </p>
            <AffiliationBlock className="mt-1" />
            {profile.postdocProgram && (
              <p className="mt-2 text-sm text-gray-600">{profile.postdocProgram}</p>
            )}
          <p className="mt-6 max-w-2xl text-gray-700 leading-relaxed">
            {profile.tagline}
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/about"
              className="px-5 py-3 rounded-md bg-primary text-white shadow hover:bg-secondary transition"
            >
              About me
            </Link>
            <Link
              href="#publications"
              className="px-5 py-3 rounded-md bg-primary text-white shadow hover:bg-secondary transition"
            >
              Publications
            </Link>
            <a
              href={profile.cvFile}
              download={profile.cvDownloadName}
              className="px-5 py-3 rounded-md border border-primary text-primary hover:bg-primary/5 transition"
            >
              Download CV
            </a>
          </div>
        </div>
        <div className="md:w-1/3 flex justify-center">
          <div className="w-56 h-56 rounded-xl overflow-hidden shadow-xl border-4 border-white bg-gray-100">
            <img
              alt={`${profile.name} portrait`}
              src={profile.portrait}
              className="w-full h-full object-cover object-[center_25%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
