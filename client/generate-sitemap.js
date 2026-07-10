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
import { usTechHubs } from './src/data/locations.js';

const DOMAIN = 'https://candidatetohr.online';
const TODAY = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

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
  '/career-guides',
  '/analyze',
  '/live-editor',
  '/resume-builder',
  '/interview-sim',
  '/rejection-decoder',
  '/learning-path',
  '/placement-probability',
  '/truth-detector',
  '/culture-fit',
  '/offer-negotiator',
  '/skill-gap',
  '/network-builder',
  '/portfolio-optimizer',
  '/sitemap'
];

function generateSitemap() {
  const coreUrls = [];

  // ── CORE SITEMAP: Static routes + hub-level content pages ──
  staticRoutes.forEach((route) => {
    const isCoreTool = ['/analyze', '/resume-builder', '/live-editor', '/interview-sim', '/rejection-decoder'].includes(route);
    coreUrls.push(`
  <url>
    <loc>${DOMAIN}${route}</loc>
    <changefreq>${(route === '/' || isCoreTool) ? 'daily' : 'weekly'}</changefreq>
    <priority>${(route === '/' || isCoreTool) ? '1.0' : '0.9'}</priority>
  </url>`);
  });

  // Roadmaps → core
  roadmapList.forEach((item) => {
    coreUrls.push(`
  <url>
    <loc>${DOMAIN}/roadmaps/${item.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  });

  // Interview Questions → core
  interviewCategories.forEach((item) => {
    coreUrls.push(`
  <url>
    <loc>${DOMAIN}/interview-questions/${item.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  });

  // Resume Examples → core
  resumeCategories.forEach((item) => {
    coreUrls.push(`
  <url>
    <loc>${DOMAIN}/resume-examples/${item.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
  });

  // Career Guides → core
  careerGuideCategories.forEach((item) => {
    coreUrls.push(`
  <url>
    <loc>${DOMAIN}/career-guides/${item.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  });

  // Salary Guides (base categories only) → core
  salaryCategories.forEach((item) => {
    coreUrls.push(`
  <url>
    <loc>${DOMAIN}/salary-guides/${item.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  });

  // Build single XML file
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${coreUrls.join('')}
</urlset>
`;

  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
  
  // Clean up old files if they exist
  if (fs.existsSync(path.join(publicDir, 'sitemap-core.xml'))) fs.unlinkSync(path.join(publicDir, 'sitemap-core.xml'));
  if (fs.existsSync(path.join(publicDir, 'sitemap-programmatic.xml'))) fs.unlinkSync(path.join(publicDir, 'sitemap-programmatic.xml'));
  
  console.log(`✅ Sitemap generated: ${coreUrls.length} high-priority URLs`);
  console.log(`✅ Canonical domain: ${DOMAIN}`);
}

generateSitemap();
