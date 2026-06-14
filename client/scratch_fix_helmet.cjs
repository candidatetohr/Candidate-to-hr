const fs = require('fs');

const files = [
  'src/pages/CareerGuideDetail.jsx',
  'src/pages/InterviewDetail.jsx',
  'src/pages/ResumeDetail.jsx',
  'src/pages/RoadmapDetail.jsx',
  'src/pages/SalaryDetail.jsx'
];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('import { Helmet }')) {
    const updated = content.replace(/import { useState, useEffect } from 'react';/, "import { useState, useEffect } from 'react';\nimport { Helmet } from 'react-helmet-async';");
    fs.writeFileSync(file, updated);
  }
});
console.log('Fixed imports');
