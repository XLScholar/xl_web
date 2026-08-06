import { getProfile } from '@/lib/content';

export default function AffiliationBlock({
  className = '',
  size = 'default',
}: {
  className?: string;
  size?: 'default' | 'compact';
}) {
  const profile = getProfile();
  const textSize = size === 'compact' ? 'text-sm' : 'text-base';

  return (
    <div className={className}>
      <p className={`${textSize} text-gray-700`}>
        {profile.department} · {profile.affiliation}
      </p>
      {profile.center && (
        <p className={`mt-1 ${size === 'compact' ? 'text-sm' : textSize} text-gray-600`}>
          {profile.center}
          {profile.centerDirector ? (
            <>
              {' '}
              · Center Director: {profile.centerDirector}
            </>
          ) : null}
        </p>
      )}
    </div>
  );
}
