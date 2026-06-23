/* eslint-env node */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import data
import { roadmapList } from './src/data/roadmaps/index.js';
import { salaryCategories } from './src/data/salaryGuides/index.js';
import { interviewCategories } from './src/data/interviewQuestions/index.js';
import { resumeCategories } from './src/data/resumeExamples/index.js';
import { careerGuideCategories } from './src/data/careerGuides/index.js';

const DOMAIN = 'https://candidatetohr.online';
const distPath = path.join(__dirname, 'dist');

if (!fs.existsSync(distPath)) {
  console.error('Error: dist/ directory not found. Please run vite build first.');
  process.exit(1);
}

const baseHtmlPath = path.join(distPath, 'index.html');
const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');

const pages = [
  // Static Routes
  { route: '/', title: 'CandidateToHR — AI-Powered Applicant Tracking System & Career Hub', desc: 'Optimize your resume, discover career roadmaps, and land your dream tech job.', type: 'Organization' },
  { route: '/about', title: 'About Us | CandidateToHR', desc: 'Learn about CandidateToHR and our mission to revolutionize tech hiring.', type: 'WebPage' },
  { route: '/contact', title: 'Contact | CandidateToHR', desc: 'Get in touch with the CandidateToHR team.', type: 'WebPage' },
  { route: '/privacy', title: 'Privacy Policy | CandidateToHR', desc: 'Read our Privacy Policy.', type: 'WebPage' },
  { route: '/terms', title: 'Terms & Conditions | CandidateToHR', desc: 'Read our Terms & Conditions.', type: 'WebPage' },
  { route: '/disclaimer', title: 'Disclaimer | CandidateToHR', desc: 'Read our official disclaimer.', type: 'WebPage' },
  { route: '/roadmaps', title: 'Tech Career Roadmaps | CandidateToHR', desc: 'Browse our comprehensive tech career roadmaps.', type: 'WebPage' },
  { route: '/interview-questions', title: 'Interview Questions | CandidateToHR', desc: 'Top interview questions and answers for tech roles.', type: 'WebPage' },
  { route: '/resume-examples', title: 'Resume Examples | CandidateToHR', desc: 'ATS-friendly resume examples for developers and engineers.', type: 'WebPage' },
  { route: '/salary-guides', title: 'Tech Salary Guides | CandidateToHR', desc: 'Discover how much you can earn in top tech roles.', type: 'WebPage' },
  { route: '/career-guides', title: 'Career Guides | CandidateToHR', desc: 'Expert guides to help you navigate your tech career.', type: 'WebPage' },
  { route: '/analyze', title: 'AI Resume Analyzer | CandidateToHR', desc: 'Get an instant AI review of your resume and ATS score.', type: 'SoftwareApplication' },
  { route: '/live-editor', title: 'Live ATS Resume Editor & Formatter | CandidateToHR', desc: 'Edit your resume live and see your ATS score update in real-time. Optimize your CV with our smart suggestions.', type: 'SoftwareApplication' },
  { route: '/resume-builder', title: 'AI Resume Builder | Create a Professional CV from Scratch | CandidateToHR', desc: 'Turn your messy notes into a perfect, ATS-optimized resume. Our AI Resume Builder structures your experience and skills instantly.', type: 'SoftwareApplication' },
  { route: '/interview-sim', title: 'Live AI Mock Interview Simulator | Voice & Text | CandidateToHR', desc: 'Practice for your next job interview with our AI Interview Simulator. Featuring real-time voice recognition and instant grading.', type: 'SoftwareApplication' },
  { route: '/rejection-decoder', title: 'AI Rejection Decoder | CandidateToHR', desc: 'Find out why you were rejected with our AI decoder.', type: 'SoftwareApplication' },
  { route: '/learning-path', title: 'AI Learning Path Generator | CandidateToHR', desc: 'Generate a custom learning path to reach your career goals.', type: 'SoftwareApplication' },
  { route: '/placement-probability', title: 'Placement Probability Engine | CandidateToHR', desc: 'Calculate your chances of getting hired for a specific role.', type: 'SoftwareApplication' },
  { route: '/truth-detector', title: 'AI Resume Truth Detector | CandidateToHR', desc: 'Detect suspicious claims and buzzword stuffing in your resume.', type: 'SoftwareApplication' },
  { route: '/culture-fit', title: 'AI Culture Fit Analyzer | CandidateToHR', desc: 'Discover if you are a culture fit for your dream company.', type: 'SoftwareApplication' },
  { route: '/offer-negotiator', title: 'AI Offer Negotiator | CandidateToHR', desc: 'Get personalized negotiation scripts and salary strategies.', type: 'SoftwareApplication' },
  { route: '/skill-gap', title: 'AI Skill Gap Analyzer | CandidateToHR', desc: 'Compare your resume to your dream job and identify missing skills.', type: 'SoftwareApplication' },
  { route: '/network-builder', title: 'AI Network Builder | CandidateToHR', desc: 'Get targeted outreach templates and networking strategies.', type: 'SoftwareApplication' },
  { route: '/portfolio-optimizer', title: 'AI Portfolio Optimizer | CandidateToHR', desc: 'Get actionable feedback on your portfolio UX and content.', type: 'SoftwareApplication' },
  { route: '/sitemap', title: 'Sitemap | CandidateToHR', desc: 'Browse all career guides, interview questions, salary guides, resume examples, and roadmaps available on CandidateToHR.', type: 'WebPage' }
];

// Dynamic Routes mapping
roadmapList.forEach(item => {
  pages.push({
    route: `/roadmaps/${item.id}`,
    title: `${item.title} | CandidateToHR`,
    desc: item.shortDescription || item.description || `A complete roadmap to becoming a ${item.title}.`,
    type: 'Article'
  });
});

salaryCategories.forEach(item => {
  pages.push({
    route: `/salary-guides/${item.id}`,
    title: `${item.title} Salary Guide | CandidateToHR`,
    desc: item.shortDescription || item.description || `Learn about the salary expectations for ${item.title}.`,
    type: 'Article'
  });
});

interviewCategories.forEach(item => {
  pages.push({
    route: `/interview-questions/${item.id}`,
    title: `Top ${item.title} Interview Questions | CandidateToHR`,
    desc: item.shortDescription || item.description || `The most frequently asked interview questions for ${item.title}.`,
    type: 'FAQPage'
  });
});

resumeCategories.forEach(item => {
  pages.push({
    route: `/resume-examples/${item.id}`,
    title: `${item.title} Resume Example | CandidateToHR`,
    desc: item.shortDescription || item.description || `An ATS-optimized resume template and example for ${item.title}.`,
    type: 'Article'
  });
});

careerGuideCategories.forEach(item => {
  pages.push({
    route: `/career-guides/${item.id}`,
    title: `${item.title} | Career Guide | CandidateToHR`,
    desc: item.shortDescription || item.description || `A definitive career guide on ${item.title}.`,
    type: 'Article'
  });
});

console.log(`Injecting SEO metadata for ${pages.length} routes...`);

let successCount = 0;

pages.forEach(({ route, title, desc, type }) => {
  try {
    const canonical = `${DOMAIN}${route}`;
    
    // Create specific JSON-LD schema
    let schemaObj = {};
    if (type === 'Organization') {
      schemaObj = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "CandidateToHR",
        "url": DOMAIN,
        "logo": `${DOMAIN}/logo.png`,
        "description": desc,
        "sameAs": []
      };
    } else if (type === 'FAQPage') {
      schemaObj = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
          "@type": "Question",
          "name": title,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": desc
          }
        }]
      };
    } else {
      schemaObj = {
        "@context": "https://schema.org",
        "@type": type,
        "headline": title,
        "description": desc,
        "url": canonical,
        "publisher": {
          "@type": "Organization",
          "name": "CandidateToHR",
          "logo": {
            "@type": "ImageObject",
            "url": `${DOMAIN}/logo.png`
          }
        }
      };
    }

    const schemaString = `<script type="application/ld+json">${JSON.stringify(schemaObj)}</script>`;

    // Replace Title & Meta Description & Inject Canonical and Schema
    let newHtml = baseHtml
      .replace(/<title>.*?<\/title>/is, `<title>${title}</title>`)
      .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/is, `<meta name="description" content="${desc}" />`);
    
    // Also inject Open Graph tags and Canonical into head
    const ogTags = `
      <link rel="canonical" href="${canonical}" />
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${desc}" />
      <meta property="og:url" content="${canonical}" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${desc}" />
    `;
    
    newHtml = newHtml.replace('</head>', `${ogTags}\n${schemaString}\n</head>`);

    // Ensure the folder exists
    const isHome = route === '/';
    const targetDir = isHome ? distPath : path.join(distPath, route.slice(1));
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetFile = path.join(targetDir, 'index.html');
    fs.writeFileSync(targetFile, newHtml);
    
    successCount++;
  } catch (err) {
    console.error(`❌ Failed to inject SEO for ${route}:`, err.message);
  }
});

console.log(`✅ Successfully injected SEO metadata for ${successCount}/${pages.length} routes.`);
