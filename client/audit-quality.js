import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, 'dist');
const DATA_DIR = path.join(__dirname, 'src', 'data');

function getHtmlFiles(dir, filesList = []) {
  if (!fs.existsSync(dir)) return filesList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getHtmlFiles(filePath, filesList);
    } else if (file.endsWith('.html')) {
      filesList.push(filePath);
    }
  }
  return filesList;
}

console.log('💎 Starting CandidateToHR Quality Assurance & Programmatic SEO Verification Audit...');

const htmlFiles = getHtmlFiles(DIST_DIR);
if (htmlFiles.length === 0) {
  console.log('⚠️ No built HTML pages found. Run "npm run build" first to pre-render the pages.');
  process.exit(0);
}

let totalWarnings = 0;
let totalFailures = 0;

for (const file of htmlFiles) {
  const relPath = path.relative(DIST_DIR, file);
  const content = fs.readFileSync(file, 'utf-8');
  
  const pageWarnings = [];
  const pageFailures = [];

  // 1. Text length (Thin Content Check)
  const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plainText.split(/\s+/).length;
  if (wordCount < 300) {
    pageWarnings.push(`Thin Content Warning: Page contains only ${wordCount} words (minimum recommended: 300).`);
  }

  // 2. Headings hierarchy Check
  const hasH1 = /<h1[^>]*>/.test(content);
  if (!hasH1) {
    pageFailures.push('Missing H1 header tag.');
  }
  const h2Count = (content.match(/<h2[^>]*>/g) || []).length;
  if (h2Count === 0 && !relPath.includes('index.html')) {
    pageWarnings.push('Missing H2 headers. Break down content with H2 subheadings.');
  }

  // 3. Structured Data Validation
  const hasSchema = /<script\s+type="application\/ld\+json">/.test(content);
  if (!hasSchema) {
    pageFailures.push('Missing structured JSON-LD schemas.');
  }

  // 4. Open Graph Metadata Check
  const hasOgTitle = /<meta\s+property="og:title"/.test(content);
  const hasOgDesc = /<meta\s+property="og:description"/.test(content);
  const hasOgImage = /<meta\s+property="og:image"/.test(content);
  if (!hasOgTitle || !hasOgDesc || !hasOgImage) {
    pageWarnings.push('Missing complete Open Graph social metadata (og:title, og:description, or og:image).');
  }

  // 5. Canonical URLs & Meta Descriptions
  const hasCanonical = /<link\s+rel="canonical"/.test(content);
  if (!hasCanonical) {
    pageFailures.push('Missing canonical URL tag.');
  }
  const hasDesc = /<meta\s+name="description"/.test(content);
  if (!hasDesc) {
    pageFailures.push('Missing meta description.');
  }

  // 6. Image Accessibility (Alt tags)
  const imgMatches = content.match(/<img\s+[^>]*>/g) || [];
  for (const img of imgMatches) {
    if (!img.includes('alt=')) {
      pageWarnings.push(`Accessibility issue: Img tag lacks alt text: ${img}`);
    }
  }

  // 7. Internal Links Audit
  const linkMatches = content.match(/href="([^"]+)"/g) || [];
  for (const linkAttribute of linkMatches) {
    const link = linkAttribute.replace('href="', '').replace('"', '');
    if (link.startsWith('/') && !link.includes('.') && link !== '/') {
      const targetHtmlFile = path.join(DIST_DIR, link === '/roadmaps' ? 'roadmaps.html' : `${link.substring(1)}.html`);
      const targetIndexFile = path.join(DIST_DIR, link.substring(1), 'index.html');
      
      // If pre-rendered route files don't exist
      if (!fs.existsSync(targetHtmlFile) && !fs.existsSync(targetIndexFile) && !link.includes(':')) {
        pageFailures.push(`Broken internal link: "${link}" (linked file not found).`);
      }
    }
  }

  if (pageFailures.length > 0 || pageWarnings.length > 0) {
    console.log(`\n📄 Page: ${relPath}`);
    pageFailures.forEach(f => {
      console.log(`   🔴 [FAILURE] ${f}`);
      totalFailures++;
    });
    pageWarnings.forEach(w => {
      console.log(`   🟡 [WARNING] ${w}`);
      totalWarnings++;
    });
  }
}

console.log('\n--- 📊 QA COMPLIANCE REPORT ---');
console.log(`Scan completed. Inspected ${htmlFiles.length} rendered pages.`);
console.log(`🔴 Failures: ${totalFailures}`);
console.log(`🟡 Warnings: ${totalWarnings}`);

if (totalFailures > 0) {
  console.log('\n❌ QA Build Check FAILED. Please resolve the critical failures listed above.');
  process.exit(1);
} else {
  console.log('\n✅ QA Build Check PASSED. Content, accessibility, and dynamic programmatic SEO guidelines are compliant.');
  process.exit(0);
}
