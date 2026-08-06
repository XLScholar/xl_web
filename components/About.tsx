'use client';

import { useEffect, useRef } from 'react';

export default function About() {
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
      id="about"
      ref={sectionRef}
      className="py-16 section-fade"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
          About Me
        </h2>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg mb-6 leading-relaxed">
            I am a Post-Doctoral Fellow and Assistant Researcher at the School of Integrated Circuits, Tsinghua University. My research bridges VLSI circuit design, power management, and machine learning-aided optimization, with a focus on solving efficiency and integration challenges in high-performance computing systems.
          </p>
          <p className="text-lg mb-6 leading-relaxed">
            I received my Ph.D. in Electronic & Computer Engineering from the Hong Kong University of Science and Technology (HKUST) in 2023, under the supervision of Prof. Wing-Hung Ki (IEEE Member). My dissertation focused on <em>IR-Drop- and Timing-Aware Power Management Techniques for Microprocessors</em>. Prior to this, I obtained my B.S. in Electronic Engineering from Southeast University (Nanjing, China) in 2018.
          </p>
          <p className="text-lg leading-relaxed">
            My work has been published in top journals/conferences including IEEE TCAS-I, APEC, CICC, and ISCAS. I am the recipient of the 2023 Youth Project of Beijing Natural Science Foundation and the 2023 Shuimu Scholarship from Tsinghua University.
          </p>
        </div>
      </div>
    </section>
  );
}
