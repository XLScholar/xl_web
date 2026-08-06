'use client';

import { useEffect, useRef, useState } from 'react';

interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: string;
  status?: string;
  type: 'journal' | 'conference';
  pdfUrl?: string;
  scholarUrl?: string;
}

export default function Publications() {
  const sectionRef = useRef<HTMLElement>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filter, setFilter] = useState<'all' | 'journal' | 'conference'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch('/api/publications');
        const data = await response.json();
        setPublications(data.publications || []);
      } catch (error) {
        console.error('Error fetching publications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  const filteredPublications = publications.filter((pub) => {
    if (filter === 'all') return true;
    return pub.type === filter;
  });

  const googleScholarUrl = 'https://scholar.google.com/citations?user=YDiR8uAAAAAJ&hl=zh-CN';

  return (
    <section
      id="publications"
      ref={sectionRef}
      className="py-16 section-fade"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            Publications
          </h2>
          <div className="mt-4 md:mt-0">
            <a
              href={googleScholarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-secondary hover:text-primary transition-colors"
            >
              <i className="fa fa-graduation-cap mr-2"></i>
              View on Google Scholar
            </a>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('journal')}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                filter === 'journal'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Journal
            </button>
            <button
              onClick={() => setFilter('conference')}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                filter === 'conference'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Conference
            </button>
          </div>

          {/* Publications list */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-neutral-dark/60">Loading publications...</p>
            </div>
          ) : filteredPublications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-dark/60">No publications found.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPublications.map((pub, index) => (
                <div
                  key={index}
                  className="border-l-4 border-primary pl-6 py-2"
                >
                  <div className="flex flex-wrap justify-between items-start">
                    <h3 className="text-lg font-semibold text-secondary mb-1">
                      <a
                        href={pub.pdfUrl || '#'}
                        className="hover:underline"
                        target={pub.pdfUrl ? '_blank' : undefined}
                        rel={pub.pdfUrl ? 'noopener noreferrer' : undefined}
                      >
                        {pub.title}
                      </a>
                    </h3>
                    <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded ml-2">
                      {pub.year} {pub.status ? `(${pub.status})` : ''}
                    </span>
                  </div>
                  <p className="text-neutral-dark/80 mb-2">{pub.authors}</p>
                  <p className="text-sm italic text-neutral-dark/70 mb-2">
                    {pub.venue}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pub.pdfUrl && (
                      <a
                        href={pub.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-secondary hover:text-primary transition-colors flex items-center"
                      >
                        <i className="fa fa-file-pdf-o mr-1"></i> PDF
                      </a>
                    )}
                    <a
                      href={googleScholarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-secondary hover:text-primary transition-colors flex items-center"
                    >
                      <i className="fa fa-google mr-1"></i> Google Scholar
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
