/* eslint-env node */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import data for dynamic routes
import { roadmapList } from './src/data/roadmaps/index.js';
import { salaryCategories } from './src/data/salaryGuides/index.js';
import { interviewCategories } from './src/data/interviewQuestions/index.js';
import { resumeCategories } from './src/data/resumeExamples/index.js';
import { careerGuideCategories } from './src/data/careerGuides/index.js';

const PORT = 3005;

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

async function run() {
  const routesToPrerender = [...staticRoutes];
  roadmapList.forEach((item) => routesToPrerender.push(`/roadmaps/${item.id}`));
  salaryCategories.forEach((item) => routesToPrerender.push(`/salary-guides/${item.id}`));
  interviewCategories.forEach((item) => routesToPrerender.push(`/interview-questions/${item.id}`));
  resumeCategories.forEach((item) => routesToPrerender.push(`/resume-examples/${item.id}`));
  careerGuideCategories.forEach((item) => routesToPrerender.push(`/career-guides/${item.id}`));

  console.log(`Starting prerender for ${routesToPrerender.length} routes...`);

  // Start Express server on dist folder
  const app = express();
  const distPath = path.join(__dirname, 'dist');
  
  if (!fs.existsSync(distPath)) {
    console.error('Error: dist/ directory not found. Please run vite build first.');
    process.exit(1);
  }

  app.use(express.static(distPath));
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  const server = app.listen(PORT, () => {
    console.log(`Static server running on http://localhost:${PORT}`);
  });

  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Disable console logs from the page to keep terminal clean
  page.on('console', () => {});

  let successCount = 0;
  let failCount = 0;

  for (const route of routesToPrerender) {
    const url = `http://localhost:${PORT}${route}`;
    try {
      // Go to page and wait for network to be completely idle
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      
      // Wait an extra second just to be sure any lazy React updates/Helmet tags apply
      await new Promise(resolve => setTimeout(resolve, 500));

      let html = await page.content();
      
      // Remove any injected puppeteer scripts if they exist
      html = html.replace(/<script[^>]*puppeteer[^>]*>.*?<\/script>/gi, '');

      // Create target directory
      const isHome = route === '/';
      const targetDir = isHome ? distPath : path.join(distPath, route.slice(1));
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const targetFile = path.join(targetDir, 'index.html');
      fs.writeFileSync(targetFile, html);
      console.log(`✅ Prerendered: ${route}`);
      successCount++;
    } catch (err) {
      console.error(`❌ Failed to prerender: ${route}`, err.message);
      failCount++;
    }
  }

  console.log(`\nPrerender complete. Success: ${successCount}, Failed: ${failCount}`);

  await browser.close();
  server.close();
  process.exit(failCount > 0 ? 1 : 0);
}

run().catch(err => {
  console.error('Prerender process failed:', err);
  process.exit(1);
});
