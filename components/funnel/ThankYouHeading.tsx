'use client';

import { useEffect, useState } from 'react';

export function ThankYouHeading() {
  const [shown, setShown] = useState('your inbox');

  useEffect(() => {
    const stored = sessionStorage.getItem('wrigital:lastEmail');
    if (stored) setShown(stored);
  }, []);

  return (
    <h1 className="text-display-xl" suppressHydrationWarning>
      On its way to {shown}
    </h1>
  );
}
