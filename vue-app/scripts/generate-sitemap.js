import { writeFileSync } from 'fs'

const BASE_URL = 'https://ваш-username.github.io/vue-betaggregator'
const PAGES = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/news', priority: 0.8, changefreq: 'daily' }
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${PAGES.map(page => `
  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
  `).join('')}
</urlset>`

writeFileSync('public/sitemap.xml', sitemap)
console.log('Sitemap generated!')