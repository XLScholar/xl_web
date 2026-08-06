import profile from '@/data/profile.json';
import news from '@/data/news.json';
import tags from '@/data/tags.json';
import publications from '@/data/publications.json';
import research from '@/data/research.json';
import posts from '@/data/posts.json';
import chipGallery from '@/data/chip-gallery.json';
import photoGallery from '@/data/photo-gallery.json';

export type Profile = typeof profile;
export type NewsItem = (typeof news)[number];
export type Tag = (typeof tags)[number];
export type Publication = (typeof publications)[number];
export type ResearchArea = (typeof research)[number];
export type Post = (typeof posts)[number];
export type ChipItem = (typeof chipGallery)[number];
export type PhotoItem = (typeof photoGallery)[number];

export function getProfile() {
  return profile;
}

export function getNews(limit?: number) {
  const sorted = [...news].sort((a, b) =>
    (b.sortKey || b.date).localeCompare(a.sortKey || a.date)
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getTags() {
  return tags;
}

export function getPublications(limit?: number) {
  return limit ? publications.slice(0, limit) : publications;
}

export function getHighlightedPublications() {
  return publications.filter((p) => p.highlight);
}

export function getFirstAuthorPublications() {
  return publications.filter((p) => p.firstAuthor);
}

export function getResearch() {
  return research;
}

export function getPosts(limit?: number) {
  return limit ? posts.slice(0, limit) : posts;
}

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function getChipGallery() {
  return chipGallery.filter((item) => Boolean(item.src));
}

export function getChipGalleryAll() {
  return chipGallery;
}

export function getPhotoGallery() {
  return photoGallery.filter((item) => Boolean(item.src));
}

export function getPhotoGalleryFeatured() {
  return getPhotoGallery().filter((item) => item.featured);
}

export function getPhotoGalleryAll() {
  return photoGallery;
}

export function getPostsByTag(tag: string) {
  return posts.filter((post) => post.tags.includes(tag));
}

export function getNewsByTag(tag: string) {
  return getNews().filter((item) => item.tags?.includes(tag));
}

export function getPublicationsByTag(tag: string) {
  return publications.filter((pub) => pub.tags?.includes(tag));
}
