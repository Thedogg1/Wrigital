/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://wrigital.com',
  generateRobotsTxt: true,
  exclude: ['/uk', '/us', '/studio'],
};
