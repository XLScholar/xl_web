import { getProfile } from '@/lib/content';

export default function Footer() {
  const profile = getProfile();

  return (
    <footer className="bg-primary text-white py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <div className="font-semibold">{profile.name}</div>
          <div className="text-sm text-white/80">
            {profile.role} — {profile.affiliationShort ?? profile.affiliation}
            {profile.center ? (
              <>
                <br />
                {profile.center}
              </>
            ) : null}
          </div>
        </div>
        <div className="text-sm text-white/70">
          © 2026 {profile.name} — Last updated: {profile.lastUpdated}
        </div>
      </div>
    </footer>
  );
}
