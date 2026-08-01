/**
 * Heuristic: URL looks like a blog post, insight article, or dated guide
 * rather than a core service / tax hub page.
 */
export function isBlogArticleUrl(urlStr: string): boolean {
  let path = '/';
  try {
    path = new URL(urlStr).pathname.toLowerCase();
  } catch {
    path = urlStr.toLowerCase();
  }

  if (
    /\/(blog|blogs|insight|insights|article|articles|news|press|magazine|stories|post|posts)(\/|$)/.test(
      path,
    )
  ) {
    return true;
  }

  // Common adviser CMS patterns (e.g. Saltus financial-planning-blog)
  if (/financial-planning-blog|wealth-planning-blog|knowledge[-_]?hub/.test(path)) {
    return true;
  }

  // /guide/slug articles (hub /guide alone is not a blog post)
  if (/\/guides?\/.+/.test(path)) {
    return true;
  }

  // WordPress-style posts at site root: one long hyphenated slug
  // e.g. /4-reasons-you-may-want-to-boost-your-isa-before-the-tax-year-ends/
  const segments = path.split('/').filter(Boolean);
  if (
    segments.length === 1 &&
    (segments[0]!.match(/-/g) ?? []).length >= 4 &&
    !/^(about|contact|team|services?|financial-planning|tax|pensions?|isas?|privacy|cookies?)$/.test(
      segments[0]!,
    )
  ) {
    return true;
  }

  return false;
}

export type PageKind = 'core' | 'blog';

export function pageKindFromUrl(urlStr: string): PageKind {
  return isBlogArticleUrl(urlStr) ? 'blog' : 'core';
}
