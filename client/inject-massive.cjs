const fs = require('fs');

const content = fs.readFileSync('src/components/seo/ComprehensiveSEOSection.jsx', 'utf-8');
const match = content.match(/const SEO_CONTENT_DB = ([\s\S]+?);\n\n\/\*\*/);

if (match) {
  const dbCode = 'module.exports = ' + match[1] + ';';
  fs.writeFileSync('temp-db.cjs', dbCode);
  const db = require('./temp-db.cjs');
  let massiveHtml = '<div style="display:none;" aria-hidden="true">';
  for (const topic in db) {
    massiveHtml += '<h2>' + db[topic].title + '</h2>';
    db[topic].sections.forEach(sec => {
      massiveHtml += '<h3>' + sec.heading + '</h3><p>' + sec.content + '</p>';
    });
  }
  massiveHtml += '</div>';
  
  let injectSeo = fs.readFileSync('inject-seo.js', 'utf-8');
  injectSeo = injectSeo.replace(/<div style="display:none;" aria-hidden="true">[\s\S]*?<\/div>/, massiveHtml);
  fs.writeFileSync('inject-seo.js', injectSeo);
  fs.unlinkSync('temp-db.cjs');
  console.log('Successfully injected massive text into inject-seo.js');
} else {
  console.log('Could not parse db');
}
