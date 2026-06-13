const fs = require('fs');

const files = [
  'd:/Resume/AI-Powered Applicant Tracking/client/src/pages/LandingPage.jsx',
  'd:/Resume/AI-Powered Applicant Tracking/client/src/components/Navbar.jsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace static domAnimation import
  content = content.replace(", domAnimation", "");
  
  // Add loadFeatures definition after imports
  const loadFeaturesStr = "const loadFeatures = () => import('../framerFeatures.js').then(res => res.default);\n";
  if (!content.includes('loadFeatures')) {
    content = content.replace(/(import .*;\n)+(const|function|export)/, match => loadFeaturesStr + "\n" + match);
  }
  
  // Change features={domAnimation} to features={loadFeatures}
  content = content.replace(/features=\{domAnimation\}/g, "features={loadFeatures}");
  
  // For LandingPage, fix the path if it's imported correctly
  if (file.includes('LandingPage.jsx')) {
     content = content.replace("import('../framerFeatures.js')", "import('../framerFeatures.js')");
  }

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
