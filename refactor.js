const fs = require('fs');

const files = [
  'd:/Resume/AI-Powered Applicant Tracking/client/src/pages/LandingPage.jsx',
  'd:/Resume/AI-Powered Applicant Tracking/client/src/components/Navbar.jsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace motion. with m.
  content = content.replace(/<motion\./g, '<m.').replace(/<\/motion\./g, '</m.');
  
  // For LandingPage, we already updated imports, but for Navbar:
  if (file.includes('Navbar.jsx')) {
    content = content.replace("import { motion, AnimatePresence } from 'framer-motion';", "import { m as motion, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';");
    
    // Wrap the navbar in LazyMotion
    content = content.replace("return (", "return (\n    <LazyMotion features={domAnimation}>");
    content = content.replace("</nav>\n  );\n}", "</nav>\n    </LazyMotion>\n  );\n}");
  }

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
