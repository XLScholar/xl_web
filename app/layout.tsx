import type { Metadata } from 'next';
import './globals.css';
import { getProfile } from '@/lib/content';

const profile = getProfile();

export const metadata: Metadata = {
  title: `${profile.name} — VLSI & Power Management`,
  description:
    'Postdoctoral Fellow researching vertical power delivery, DC-DC converters, and clock-power co-design. CV and publications for faculty applications.',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: profile.name,
              jobTitle: profile.role,
              affiliation: profile.affiliation,
              email: profile.email,
            }),
          }}
        />
      </head>
      <body className="font-sans text-neutral-dark bg-white">{children}</body>
    </html>
  );
}
