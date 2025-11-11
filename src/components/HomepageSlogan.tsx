'use client';

import { getTranslation } from '@/lib/i18n';

interface HomepageSloganProps {
  locale?: 'en' | 'tr';
}

export default function HomepageSlogan({ locale = 'en' }: HomepageSloganProps) {
  const t = getTranslation(locale);
  
  return (
    <p 
      className="text-center text-lg md:text-xl text-gray-300 mb-12 font-medium max-w-xl mx-auto px-4"
      role="heading"
      aria-level={2}
    >
      {t.homepage.slogan}
    </p>
  );
}
