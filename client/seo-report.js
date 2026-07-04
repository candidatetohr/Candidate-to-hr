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

const htmlFiles = getHtmlFiles(DIST_DIR);
if (htmlFiles.length === 0) {
  console.log('No HTML files found. Please run npm run build.');
  process.exit(1);
}

const report = [];

// First pass: map out URLs to file paths and count total words
const urlMap = {};
htmlFiles.forEach(file => {
  const relPath = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  let urlPath = '/' + relPath.replace('.html', '').replace('/index', '');
  if (urlPath === '/index') urlPath = '/';
  
  const content = fs.readFileSync(file, 'utf-8');
  
  // Calculate word count
  const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plainText.split(/\s+/).length;
  
  // Find all internal links
  const links = [];
  // Match either href="/path" or href="https://candidatetohr.online/path"
  const linkMatches = content.match(/href="(\/[^"]+|https:\/\/candidatetohr\.online\/[^"]+)"/g) || [];
  linkMatches.forEach(match => {
    let link = match.replace('href="', '').replace('"', '');
    link = link.replace('https://candidatetohr.online', '');
    links.push(link);
  });
  
  report.push({
    file: relPath,
    url: urlPath,
    wordCount: wordCount,
    outboundInternalLinks: links,
    inboundInternalLinks: 0
  });
  
  urlMap[urlPath] = report[report.length - 1];
});

// Second pass: count inbound internal links (backlinks)
report.forEach(page => {
  page.outboundInternalLinks.forEach(link => {
    // Exact match or match with trailing slash
    let target = urlMap[link] || urlMap[link.replace(/\/$/, '')];
    if (target) {
      target.inboundInternalLinks++;
    }
  });
});

// Sort by word count descending
report.sort((a, b) => b.wordCount - a.wordCount);

let md = '# Site Content & Internal Backlink Report\n\n';
md += 'This report analyzes the generated static HTML files in the `dist` directory. It shows the word count for each page and the number of internal backlinks (how many other pages on the site link to it).\n\n';
md += '| Page URL | Word Count | Internal Backlinks |\n';
md += '| :--- | :--- | :--- |\n';

report.forEach(page => {
  md += `| ${page.url} | ${page.wordCount.toLocaleString()} words | ${page.inboundInternalLinks} links |\n`;
});

fs.writeFileSync('seo_report.md', md, 'utf-8');
console.log('Report generated at seo_report.md');
