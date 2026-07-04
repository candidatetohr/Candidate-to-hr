const fs = require('fs');
const path = require('path');
const sitemapPath = path.join(__dirname, 'public/sitemap.xml');
let content = fs.readFileSync(sitemapPath, 'utf8');
const today = new Date().toISOString().split('T')[0];
content = content.replace(/<lastmod>.*?<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
fs.writeFileSync(sitemapPath, content, 'utf8');
console.log('Sitemap lastmod dates updated to ' + today);
