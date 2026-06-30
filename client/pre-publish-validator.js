import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PLACEHOLDER_PATTERNS = [
  /\[your\s+name\]/i,
  /\[insert\s+year\]/i,
  /lorem\s+ipsum/i,
  /\[company\s+name\]/i,
  /TODO/i,
  /placeholder/i
];

function getWordCount(obj) {
  let text = '';
  function traverse(item) {
    if (typeof item === 'string') {
      text += ' ' + item;
    } else if (Array.isArray(item)) {
      item.forEach(traverse);
    } else if (item && typeof item === 'object') {
      Object.values(item).forEach(traverse);
    }
  }
  traverse(obj);
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function extractAllLinks(obj) {
  const links = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  
  function traverse(item) {
    if (typeof item === 'string') {
      let match;
      while ((match = linkRegex.exec(item)) !== null) {
        links.push(match[2]);
      }
      // Also match raw URLs or paths
      const urlRegex = /(?:https:\/\/candidatetohr\.online|\b)(?:\/(?:resume-examples|interview-questions|career-guides|salary-guides|roadmaps)\/[a-zA-Z0-9-_]+)/g;
      let rawMatch;
      while ((rawMatch = urlRegex.exec(item)) !== null) {
        links.push(rawMatch[0]);
      }
    } else if (Array.isArray(item)) {
      item.forEach(traverse);
    } else if (item && typeof item === 'object') {
      Object.values(item).forEach(traverse);
    }
  }
  traverse(obj);
  return links;
}

function validateFile(filePath, type) {
  console.log(`\n🔍 Validating ${path.basename(filePath)} (${type})...`);
  const contentRaw = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = JSON.parse(contentRaw);
  } catch (err) {
    console.error(`❌ Invalid JSON format: ${err.message}`);
    return false;
  }

  let passed = true;

  // 1. Placeholder Check
  PLACEHOLDER_PATTERNS.forEach(pattern => {
    if (pattern.test(contentRaw)) {
      console.error(`❌ Error: Found placeholder pattern matching ${pattern} in file.`);
      passed = false;
    }
  });

  // 2. Word Count Check
  const wordCount = getWordCount(data);
  console.log(`ℹ️ Word count: ${wordCount}`);
  
  let minWords = 1200;
  let maxWords = 2500;
  
  if (type === 'resume') { minWords = 1200; maxWords = 1800; }
  else if (type === 'interview') { minWords = 1800; maxWords = 2500; }
  else if (type === 'career') { minWords = 1500; maxWords = 2500; }
  else if (type === 'salary') { minWords = 1200; maxWords = 1800; }
  else if (type === 'roadmap') { minWords = 1200; maxWords = 2000; }

  if (wordCount < minWords) {
    console.error(`❌ Error: Word count ${wordCount} is below minimum required ${minWords} words.`);
    passed = false;
  } else {
    console.log(`✅ Word count constraint met (${wordCount} words).`);
  }

  // 3. FAQ Section Check
  const faq = data.faq;
  if (!faq || !Array.isArray(faq) || faq.length < 10) {
    console.error(`❌ Error: FAQ section is missing or has less than 10 questions. (Found: ${faq ? faq.length : 0})`);
    passed = false;
  } else {
    console.log(`✅ FAQ count is valid (${faq.length} questions).`);
  }

  // 4. Interview-specific: 50 Questions Check
  if (type === 'interview') {
    let questionCount = 0;
    if (data.questions) {
      if (Array.isArray(data.questions)) {
        questionCount = data.questions.length;
      } else if (typeof data.questions === 'object') {
        Object.keys(data.questions).forEach(k => {
          if (Array.isArray(data.questions[k])) {
            questionCount += data.questions[k].length;
          }
        });
      }
    } else if (data.categories) {
      // Nested questions count
      Object.keys(data.categories).forEach(k => {
        if (Array.isArray(data.categories[k])) {
          questionCount += data.categories[k].length;
        }
      });
    }
    if (questionCount < 50) {
      console.error(`❌ Error: Interview questions guide must have at least 50 questions. (Found: ${questionCount})`);
      passed = false;
    } else {
      console.log(`✅ Interview question count is valid (${questionCount} questions).`);
    }
  }

  // 5. Internal Links Check
  const links = extractAllLinks(data);
  const internalLinks = links.filter(link => {
    return link.startsWith('/') || link.includes('candidatetohr.online');
  });

  const categoriesLinked = {
    resume: 0,
    interview: 0,
    career: 0,
    salary: 0,
    roadmap: 0
  };

  internalLinks.forEach(link => {
    if (link.includes('/resume-examples/')) categoriesLinked.resume++;
    else if (link.includes('/interview-questions/')) categoriesLinked.interview++;
    else if (link.includes('/career-guides/')) categoriesLinked.career++;
    else if (link.includes('/salary-guides/')) categoriesLinked.salary++;
    else if (link.includes('/roadmaps/')) categoriesLinked.roadmap++;
  });

  console.log(`ℹ️ Internal links found: ${internalLinks.length}`);
  console.log(`  - Resume Examples: ${categoriesLinked.resume}`);
  console.log(`  - Interview Questions: ${categoriesLinked.interview}`);
  console.log(`  - Career Guides: ${categoriesLinked.career}`);
  console.log(`  - Salary Guides: ${categoriesLinked.salary}`);
  console.log(`  - Roadmaps: ${categoriesLinked.roadmap}`);

  if (internalLinks.length < 7) {
    console.error(`❌ Error: Total internal links (${internalLinks.length}) is below required minimum of 7.`);
    passed = false;
  }
  if (categoriesLinked.resume < 2) {
    console.error(`❌ Error: Must link to at least 2 Resume Examples. (Found: ${categoriesLinked.resume})`);
    passed = false;
  }
  if (categoriesLinked.interview < 2) {
    console.error(`❌ Error: Must link to at least 2 Interview Question Pages. (Found: ${categoriesLinked.interview})`);
    passed = false;
  }
  if (categoriesLinked.career < 1) {
    console.error(`❌ Error: Must link to at least 1 Career Guide. (Found: ${categoriesLinked.career})`);
    passed = false;
  }
  if (categoriesLinked.salary < 1) {
    console.error(`❌ Error: Must link to at least 1 Salary Guide. (Found: ${categoriesLinked.salary})`);
    passed = false;
  }
  if (categoriesLinked.roadmap < 1) {
    console.error(`❌ Error: Must link to at least 1 Roadmap. (Found: ${categoriesLinked.roadmap})`);
    passed = false;
  }

  if (passed) {
    console.log(`✅ ${path.basename(filePath)} is 100% compliant!`);
  }
  return passed;
}

// Read args
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node pre-publish-validator.js <path-to-json-file>:<type>');
  console.log('Types: resume, interview, career, salary, roadmap');
  process.exit(0);
}

let allPassed = true;
args.forEach(arg => {
  const [filePath, type] = arg.split(':');
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: File not found: ${filePath}`);
    allPassed = false;
    return;
  }
  if (!['resume', 'interview', 'career', 'salary', 'roadmap'].includes(type)) {
    console.error(`❌ Error: Invalid type "${type}" for ${filePath}`);
    allPassed = false;
    return;
  }
  const result = validateFile(filePath, type);
  if (!result) allPassed = false;
});

if (allPassed) {
  console.log('\n🎉 All checked files passed verification and are ready to publish!');
  process.exit(0);
} else {
  console.error('\n❌ Verification failed for one or more files. DO NOT PUBLISH.');
  process.exit(1);
}
