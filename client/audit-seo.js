import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, 'dist');

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

console.log('🔍 Starting Weekly SEO Audit & Validation Scan...');

const htmlFiles = getHtmlFiles(DIST_DIR);
if (htmlFiles.length === 0) {
  console.log('⚠️ No built HTML pages found in client/dist. Make sure you run "npm run build" first.');
  process.exit(0);
}

let issuesFound = 0;
const titles = new Map();
const descriptions = new Map();

for (const file of htmlFiles) {
  const relPath = path.relative(DIST_DIR, file);
  const content = fs.readFileSync(file, 'utf-8');
  const fileIssues = [];

  // 1. Check title tag
  const titleMatch = content.match(/<title>([^<]+)<\/title>/);
  if (!titleMatch) {
    fileIssues.push('❌ Missing <title> tag.');
  } else {
    const val = titleMatch[1];
    if (titles.has(val)) {
      fileIssues.push(`⚠️ Duplicate title: "${val}" (originally in ${titles.get(val)})`);
    } else {
      titles.set(val, relPath);
    }
  }

  // 2. Check meta description
  const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  if (!descMatch) {
    fileIssues.push('❌ Missing meta description.');
  } else {
    const val = descMatch[1];
    if (descriptions.has(val)) {
      fileIssues.push(`⚠️ Duplicate description: "${val}" (originally in ${descriptions.get(val)})`);
    } else {
      descriptions.set(val, relPath);
    }
  }

  // 3. Check canonical link
  const canonicalMatch = content.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  if (!canonicalMatch) {
    fileIssues.push('❌ Missing canonical link.');
  }

  // 4. Check structured JSON-LD schemas
  const schemaMatches = content.match(/<script\s+type="application\/ld\+json">/g);
  if (!schemaMatches) {
    fileIssues.push('❌ Missing structured data JSON-LD schemas.');
  }

  // 5. Check missing alt text on img tags
  const imgMatches = content.match(/<img\s+[^>]*>/g) || [];
  for (const img of imgMatches) {
    if (!img.includes('alt=')) {
      fileIssues.push(`⚠️ Img tag lacks alt text: ${img}`);
    }
  }

  if (fileIssues.length > 0) {
    console.log(`\n📄 File: ${relPath}`);
    fileIssues.forEach(issue => {
      console.log(`   ${issue}`);
      issuesFound++;
    });
  }
}

console.log('\n--- 📊 AUDIT SUMMARY ---');
console.log(`Scan completed. Inspected ${htmlFiles.length} HTML files.`);
if (issuesFound > 0) {
  console.log(`⚠️ Found ${issuesFound} potential SEO issue(s). Please review the logs above.`);
} else {
  console.log('✅ 100% SEO Compliance! All structured schemas, canon-links, meta-tags, and alt attributes are clean.');
}
