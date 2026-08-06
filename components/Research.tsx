'use client';

import { useEffect, useRef } from 'react';

export default function Research() {
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

  return (
    <section
      id="research"
      ref={sectionRef}
      className="py-16 bg-neutral section-fade"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
          Research Interests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Direction 1: VLSI */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <i className="fa fa-microchip text-primary text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-secondary mb-3">
              VLSI & SoCs
            </h3>
            <p className="text-neutral-dark/75">
              Integrated clock and power management circuits, energy-efficient computing architectures for high-performance microprocessors.
            </p>
          </div>

          {/* Direction 2: Hardware-Software Co-Design */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <i className="fa fa-code-fork text-primary text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-secondary mb-3">
              Hardware-Software Co-Design
            </h3>
            <p className="text-neutral-dark/75">
              ML-aided design of systems-on-chip (SoC) and hardware accelerators for AI computation and low-power applications.
            </p>
          </div>

          {/* Direction 3: Power Converters */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <i className="fa fa-bolt text-primary text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-secondary mb-3">
              Power Converters
            </h3>
            <p className="text-neutral-dark/75">
              Computational intelligence, control algorithms, and novel topologies (e.g., ReSC) for high-efficiency power electronics in HPC.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
