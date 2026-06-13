import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Determine __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import data
import { roadmapList } from './src/data/roadmaps/index.js';
import { salaryCategories } from './src/data/salaryGuides/index.js';
import { interviewCategories } from './src/data/interviewQuestions/index.js';
import { resumeCategories } from './src/data/resumeExamples/index.js';
import { careerGuideCategories } from './src/data/careerGuides/index.js';

const DOMAIN = 'https://candidatetohr.online'; // Replace with actual domain

const staticRoutes = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/disclaimer',
  '/roadmaps',
  '/interview-questions',
  '/resume-examples',
  '/salary-guides',
  '/career-guides'
];

function generateSitemap() {
  const urls = [];

  // Add static routes
  staticRoutes.forEach((route) => {
    urls.push(`
  <url>
    <loc>${DOMAIN}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`);
  });

  // Add Roadmaps
  roadmapList.forEach((item) => {
    urls.push(`
  <url>
    <loc>${DOMAIN}/roadmaps/${item.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  });

  // Add Salary Guides
  salaryCategories.forEach((item) => {
    urls.push(`
  <url>
    <loc>${DOMAIN}/salary-guides/${item.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  });

  // Add Interview Questions
  interviewCategories.forEach((item) => {
    urls.push(`
  <url>
    <loc>${DOMAIN}/interview-questions/${item.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  });

  // Add Resume Examples
  resumeCategories.forEach((item) => {
    urls.push(`
  <url>
    <loc>${DOMAIN}/resume-examples/${item.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  });

  // Add Career Guides
  careerGuideCategories.forEach((item) => {
    urls.push(`
  <url>
    <loc>${DOMAIN}/career-guides/${item.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>
`;

  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log(`✅ Sitemap successfully generated at: ${sitemapPath} with ${urls.length} URLs`);
}

generateSitemap();
