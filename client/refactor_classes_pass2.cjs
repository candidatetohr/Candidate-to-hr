const fs = require('fs');
const path = require('path');

const dir = 'src';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const componentReplacements = {
  // Forms
  'input-field': 'form-input',
  
  // Cards
  'rd-card': 'card',
  'glass-card': 'card', // standardizing entirely to card
  'glass-panel': 'card',
  'rd-timeline-item': 'timeline-item',
  
  // Containers
  'rd-container': 'container-seo',
  
  // Remove unused or duplicate layout paddings inside components
  // the script will handle this if needed, but let's just stick to naming.
};

walk(dir, function(filePath) {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace classNames
    content = content.replace(/className="([^"]+)"/g, (match, classes) => {
      let classArray = classes.split(' ');
      let newClasses = classArray.map(cls => componentReplacements[cls] !== undefined ? componentReplacements[cls] : cls)
        .filter(Boolean)
        .join(' ');
      newClasses = [...new Set(newClasses.split(' '))].join(' ');
      return `className="${newClasses}"`;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Standardized classes in ${filePath}`);
    }
  }
});
console.log('JSX Standardization Complete.');
