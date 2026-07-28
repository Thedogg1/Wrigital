import {
  REPORT_EXPIRED_BODY,
  REPORT_EXPIRED_HEADLINE,
} from '@/lib/unverifiedAnswers';
import {
  buildUnverifiedReportHtml,
  getReportResult,
} from '@/lib/unverified-answers/buildReportHtml';
import {
  isReportExpired,
  loadReport,
} from '@/lib/unverified-answers/reportStore';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ token: string }>;
};

function expiredHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>${REPORT_EXPIRED_HEADLINE}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; color: #212529; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; }
    h1 { color: #0a2463; }
    .brand { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #b08d57; }
    a { color: #0a2463; }
  </style>
</head>
<body>
  <p class="brand">Wrigital</p>
  <h1>${REPORT_EXPIRED_HEADLINE}</h1>
  <p>${REPORT_EXPIRED_BODY}</p>
  <p><a href="/unverified-answer-count">Run the counter again</a></p>
</body>
</html>`;
}

export async function GET(_request: Request, context: RouteContext) {
  const { token: rawToken } = await context.params;
  const token = decodeURIComponent(rawToken);
  const report = await loadReport(token);

  if (!report || isReportExpired(report)) {
    return new Response(expiredHtml(), {
      status: 410,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
        'Cache-Control': 'no-store',
      },
    });
  }

  const result = getReportResult(report.answers);
  const html = buildUnverifiedReportHtml({
    answers: report.answers,
    result,
    firmName: report.firmName,
    generatedAt: new Date(report.createdAt),
  });

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'private, no-store',
    },
  });
}
