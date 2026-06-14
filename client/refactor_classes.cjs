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

const tailwindReplacements = {
  // Colors
  'bg-slate-800': 'bg-card',
  'bg-slate-900': 'bg-primary',
  'bg-slate-700': 'bg-surface',
  'bg-slate-50': 'bg-surface',
  'text-slate-400': 'text-secondary',
  'text-slate-500': 'text-secondary',
  'text-slate-300': 'text-primary',
  'text-slate-200': 'text-primary',
  'text-slate-100': 'text-primary',
  'text-slate-900': 'text-primary',
  'text-white': 'text-inverse',
  'text-blue-500': 'color-primary',
  'text-blue-400': 'color-primary',
  'text-emerald-500': 'color-success',
  'text-emerald-400': 'color-success',
  'text-green-500': 'color-success',
  'text-green-400': 'color-success',
  'text-amber-500': 'color-warning',
  'text-amber-400': 'color-warning',
  'text-red-500': 'color-error',
  'text-red-400': 'color-error',
  'border-slate-800': 'border-default',
  'border-slate-700': 'border-default',
  'border-slate-200': 'border-default',
  'border-slate-300': 'border-default',

  // Spacing (Translating tailwind multiples of 4px to our scale 8, 16, 24, 32, 48, 64, 96)
  'p-2': 'p-8',
  'p-4': 'p-16',
  'p-6': 'p-24',
  'p-8': 'p-32',
  'p-10': 'p-48',
  'p-12': 'p-48',
  'p-16': 'p-64',
  'p-24': 'p-96',

  'pt-2': 'pt-8', 'pt-4': 'pt-16', 'pt-6': 'pt-24', 'pt-8': 'pt-32', 'pt-10': 'pt-48', 'pt-12': 'pt-48', 'pt-16': 'pt-64', 'pt-24': 'pt-96',
  'pb-2': 'pb-8', 'pb-4': 'pb-16', 'pb-6': 'pb-24', 'pb-8': 'pb-32', 'pb-10': 'pb-48', 'pb-12': 'pb-48', 'pb-16': 'pb-64', 'pb-24': 'pb-96',
  
  'm-2': 'm-8', 'm-4': 'm-16', 'm-6': 'm-24', 'm-8': 'm-32', 'm-10': 'm-48', 'm-12': 'm-48', 'm-16': 'm-64', 'm-24': 'm-96',
  'mt-2': 'mt-8', 'mt-4': 'mt-16', 'mt-6': 'mt-24', 'mt-8': 'mt-32', 'mt-10': 'mt-48', 'mt-12': 'mt-48', 'mt-16': 'mt-64', 'mt-24': 'mt-96',
  'mb-2': 'mb-8', 'mb-4': 'mb-16', 'mb-6': 'mb-24', 'mb-8': 'mb-32', 'mb-10': 'mb-48', 'mb-12': 'mb-48', 'mb-16': 'mb-64', 'mb-24': 'mb-96',
  
  'gap-2': 'gap-8',
  'gap-4': 'gap-16',
  'gap-6': 'gap-24',
  'gap-8': 'gap-32',
  'gap-12': 'gap-48',

  // Layouts
  'rounded-lg': '',
  'rounded-xl': '',
  'rounded-2xl': '',
  'rounded-md': '',
  'shadow-lg': '',
  'shadow-md': '',
  'max-w-7xl': 'container-standard',
  'max-w-4xl': 'container-seo',
  'max-w-3xl': 'container-seo',
  'mx-auto': '',
};

walk(dir, function(filePath) {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace classNames
    content = content.replace(/className="([^"]+)"/g, (match, classes) => {
      let classArray = classes.split(' ');
      let newClasses = classArray.map(cls => tailwindReplacements[cls] !== undefined ? tailwindReplacements[cls] : cls)
        .filter(Boolean)
        .join(' ');
      // unique
      newClasses = [...new Set(newClasses.split(' '))].join(' ');
      return `className="${newClasses}"`;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
console.log('JSX Audit Complete.');
