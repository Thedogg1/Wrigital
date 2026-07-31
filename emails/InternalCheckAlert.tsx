import * as React from 'react';
import type { CheckResult } from '@/lib/check-types';
import { siteUrl } from '@/lib/site';

export function InternalCheckAlert({
  result,
  email,
}: {
  result: CheckResult;
  email: string;
}) {
  const behind = result.findings.filter((f) => f.verdict === 'behind').slice(0, 3);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14 }}>
      <p>Email: {email}</p>
      <p>Domain: {result.domain}</p>
      <p>Figures found: {result.figuresFound}</p>
      <p>Behind: {result.behindCount}</p>
      {behind.length > 0 && (
        <>
          <p>Top behind findings:</p>
          <ul>
            {behind.map((f) => (
              <li key={f.id}>
                {f.label}: {f.quotedValue} (published {f.publishedValue})
              </li>
            ))}
          </ul>
        </>
      )}
      <p>
        Check id: {result.checkId} ({siteUrl})
      </p>
    </div>
  );
}

export default InternalCheckAlert;
