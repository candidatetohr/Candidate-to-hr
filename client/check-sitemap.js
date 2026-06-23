import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read sitemap.xml
const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

// Load index categories
import { roadmapList } from './src/data/roadmaps/index.js';
import { salaryCategories } from './src/data/salaryGuides/index.js';
import { interviewCategories } from './src/data/interviewQuestions/index.js';
import { resumeCategories } from './src/data/resumeExamples/index.js';
import { careerGuideCategories } from './src/data/careerGuides/index.js';

const directories = [
  { dir: 'src/data/roadmaps', ext: 'roadmap-2026', prefix: '/roadmaps/', registry: roadmapList },
  { dir: 'src/data/salaryGuides', ext: 'salary-guide-2026', prefix: '/salary-guides/', registry: salaryCategories },
  { dir: 'src/data/interviewQuestions', prefix: '/interview-questions/', registry: interviewCategories },
  { dir: 'src/data/resumeExamples', prefix: '/resume-examples/', registry: resumeCategories },
  { dir: 'src/data/careerGuides', prefix: '/career-guides/', registry: careerGuideCategories }
];

console.log('--- Checking Sitemap Integrations ---');

let missingCount = 0;

// 1. Check if all JSON files exist on disk and are in the sitemap
directories.forEach(({ dir, prefix, registry }) => {
  const fullDir = path.join(__dirname, dir);
  const files = fs.readdirSync(fullDir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));

  files.forEach(fileId => {
    const route = `${prefix}${fileId}`;
    const isInSitemap = sitemapContent.includes(route);
    const isInRegistry = registry.some(item => item.id === fileId);

    if (!isInRegistry) {
      console.warn(`⚠️ JSON file exists but is NOT registered in index: ${dir}/${fileId}.json`);
      missingCount++;
    }
    if (!isInSitemap) {
      console.warn(`❌ Route NOT found in sitemap: ${route}`);
      missingCount++;
    }
  });
});

// 2. Check if all registered index routes are in sitemap
directories.forEach(({ dir, prefix, registry }) => {
  registry.forEach(item => {
    const route = `${prefix}${item.id}`;
    const isInSitemap = sitemapContent.includes(route);
    if (!isInSitemap) {
      console.warn(`❌ Registered item id "${item.id}" (from ${dir}/index.js) NOT found in sitemap.`);
      missingCount++;
    }
  });
});

if (missingCount === 0) {
  console.log('✅ Success! All JSON content files are successfully registered and present in the sitemap.');
} else {
  console.log(`❌ Found ${missingCount} discrepancies.`);
}
