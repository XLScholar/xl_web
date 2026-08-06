'use client';

import { useEffect, useRef } from 'react';

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

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

  const googleScholarUrl = 'https://scholar.google.com/citations?user=YDiR8uAAAAAJ&hl=zh-CN';

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-16 bg-neutral section-fade"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
          Contact
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-secondary mb-6">
              Get In Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fa fa-envelope text-primary"></i>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Email</h4>
                  <a
                    href="mailto:xwangef@tsinghua.edu.cn"
                    className="text-secondary hover:text-primary transition-colors"
                  >
                    xwangef@tsinghua.edu.cn
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fa fa-map-marker text-primary"></i>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Address</h4>
                  <p className="text-neutral-dark/80">
                    School of Integrated Circuits<br />
                    Tsinghua University<br />
                    Haidian District, Beijing, China 100084
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Platforms */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-secondary mb-6">
              Connect With Me
            </h3>
            <div className="space-y-4">
              <a
                href={googleScholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fa fa-graduation-cap text-primary"></i>
                </div>
                <div>
                  <h4 className="font-medium">Google Scholar</h4>
                  <p className="text-sm text-neutral-dark/60">
                    Publications & Citations
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
