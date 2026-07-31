'use client';

import { useEffect, useState } from 'react';

export function ThankYouHeading() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(sessionStorage.getItem('wrigital:lastEmail'));
  }, []);

  const shown = email ?? 'your inbox';

  return <h1 className="text-display-xl">On its way to {shown}</h1>;
}
