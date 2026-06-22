/* eslint-env node */
import fs from 'fs';
import path from 'path';

const directory = 'd:/Resume/AI-Powered Applicant Tracking/client/src/pages';
const files = fs.readdirSync(directory).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(directory, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if file uses Helmet
  if (content.includes('react-helmet-async')) {
    // Determine relative path to SEO.jsx depending on the file location
    // Since all are in src/pages/, it's '../components/SEO'
    
    // Replace import
    content = content.replace(/import\s+{\s*Helmet\s*}\s+from\s+['"]react-helmet-async['"];?/g, "import SEO from '../components/SEO';");

    // Replace Helmet block
    // Assuming simple format: <Helmet>\n  <title>Title</title>\n  <meta name="description" content="Desc" />\n</Helmet>
    const regex = /<Helmet>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<meta name="description" content="(.*?)"\s*\/?\>[\s\S]*?<\/Helmet>/g;
    
    content = content.replace(regex, (match, title, description) => {
      return `<SEO title="${title}" description="${description}" />`;
    });

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${file}`);
  }
});
