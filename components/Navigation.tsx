'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const navItems = [
  { href: '/about', label: 'About' },
  { href: '/news', label: 'Timeline' },
  { href: '/#research', label: 'Research' },
  { href: '/#publications', label: 'Pubs' },
  { href: '/gallery/chips', label: 'Chips' },
  { href: '/gallery/photos', label: 'Photos' },
  { href: '/archive', label: 'Archive' },
  { href: '/cv', label: 'CV' },
  { href: '/#contact', label: 'Contact' },
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full bg-white/95 backdrop-blur z-50 border-b transition-shadow ${
        isScrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-semibold text-primary">
          Xuliang Wang
        </Link>
        <nav className="hidden xl:flex gap-4 text-gray-700 text-sm">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-secondary transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <button aria-label="menu" className="xl:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </button>
      </div>
      {isMenuOpen && (
        <div className="xl:hidden border-t bg-white px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
