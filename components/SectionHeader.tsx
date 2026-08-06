import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  description?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export default function SectionHeader({
  title,
  description,
  viewAllHref,
  viewAllLabel = 'View all',
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
      <div>
        <h2 className="text-3xl font-bold text-primary">{title}</h2>
        {description && <p className="mt-2 text-gray-600">{description}</p>}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="text-primary font-medium hover:text-secondary transition-colors whitespace-nowrap"
        >
          {viewAllLabel} →
        </Link>
      )}
    </div>
  );
}
