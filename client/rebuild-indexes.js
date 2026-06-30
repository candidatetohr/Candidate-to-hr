import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'src', 'data');

// Helper to calculate reading time
function getReadTime(text) {
  const words = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

// Helper to count interview questions
function countQuestions(faq, sections) {
  let count = 0;
  if (faq) count += faq.length;
  if (sections) {
    sections.forEach(s => {
      // Look for numbered list items or Q: items in content
      const matches = s.content ? s.content.match(/^\d+\.\s/gm) : null;
      if (matches) count += matches.length;
    });
  }
  return count || 50; // Fallback to 50 if undetermined
}

function rebuildResumeExamples() {
  const dir = path.join(DATA_DIR, 'resumeExamples');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  const categories = [];

  files.forEach(file => {
    const content = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    const id = file.replace('.json', '');
    
    // Infer role from keywords or name
    let role = 'Development';
    const titleLower = content.seo.title.toLowerCase();
    if (titleLower.includes('data') || titleLower.includes('ai') || titleLower.includes('intelligence') || titleLower.includes('scientist')) {
      role = 'Data & AI';
    } else if (titleLower.includes('product') || titleLower.includes('manager') || titleLower.includes('business')) {
      role = 'Management';
    } else if (titleLower.includes('security') || titleLower.includes('cyber')) {
      role = 'Security';
    } else if (titleLower.includes('devops') || titleLower.includes('infrastructure') || titleLower.includes('reliability') || titleLower.includes('architect') || titleLower.includes('administrator')) {
      role = 'Infrastructure';
    } else if (titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux')) {
      role = 'Design';
    } else if (titleLower.includes('qa') || titleLower.includes('test') || titleLower.includes('automation')) {
      role = 'QA & Testing';
    }

    if (content.metadata && content.metadata.role) {
      role = content.metadata.role;
    }

    categories.push({
      id,
      title: content.hero.title,
      description: content.seo.description,
      role
    });
  });

  const indexContent = `export const resumeCategories = ${JSON.stringify(categories, null, 2)};\n`;
  fs.writeFileSync(path.join(dir, 'index.js'), indexContent, 'utf8');
  console.log(`✅ Rebuilt resumeExamples/index.js with ${categories.length} entries`);
}

function rebuildInterviewQuestions() {
  const dir = path.join(DATA_DIR, 'interviewQuestions');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  const categories = [];

  files.forEach(file => {
    const content = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    const id = file.replace('.json', '');
    
    let topic = 'Programming';
    const titleLower = content.seo.title.toLowerCase();
    if (titleLower.includes('sql') || titleLower.includes('database') || titleLower.includes('db')) {
      topic = 'Database';
    } else if (titleLower.includes('react') || titleLower.includes('javascript') || titleLower.includes('frontend') || titleLower.includes('css') || titleLower.includes('html')) {
      topic = 'Frontend';
    } else if (titleLower.includes('node') || titleLower.includes('backend') || titleLower.includes('golang') || titleLower.includes('python') || titleLower.includes('java')) {
      topic = 'Programming';
    } else if (titleLower.includes('data') || titleLower.includes('ai') || titleLower.includes('intelligence') || titleLower.includes('science') || titleLower.includes('learning')) {
      topic = 'Data & AI';
    } else if (titleLower.includes('system design') || titleLower.includes('architecture')) {
      topic = 'Architecture';
    } else if (titleLower.includes('aws') || titleLower.includes('cloud')) {
      topic = 'Cloud';
    } else if (titleLower.includes('devops') || titleLower.includes('kubernetes') || titleLower.includes('sre') || titleLower.includes('reliability')) {
      topic = 'DevOps';
    } else if (titleLower.includes('product')) {
      topic = 'Product';
    } else if (titleLower.includes('behavioral') || titleLower.includes('hr')) {
      topic = 'Behavioral';
    } else if (titleLower.includes('qa') || titleLower.includes('test') || titleLower.includes('automation')) {
      topic = 'QA & Testing';
    }

    if (content.metadata && content.metadata.topic) {
      topic = content.metadata.topic;
    }

    // Determine count of questions
    let count = 0;
    if (content.questions) {
      if (Array.isArray(content.questions)) {
        count = content.questions.length;
      } else if (typeof content.questions === 'object') {
        Object.keys(content.questions).forEach(k => {
          if (Array.isArray(content.questions[k])) {
            count += content.questions[k].length;
          }
        });
      }
    } else if (content.categories) {
      // Nested questions count
      Object.keys(content.categories).forEach(k => {
        if (Array.isArray(content.categories[k])) {
          count += content.categories[k].length;
        }
      });
    }

    categories.push({
      id,
      title: content.hero.title,
      description: content.seo.description,
      topic,
      count: count || 50
    });
  });

  const indexContent = `export const interviewCategories = ${JSON.stringify(categories, null, 2)};\n`;
  fs.writeFileSync(path.join(dir, 'index.js'), indexContent, 'utf8');
  console.log(`✅ Rebuilt interviewQuestions/index.js with ${categories.length} entries`);
}

function rebuildCareerGuides() {
  const dir = path.join(DATA_DIR, 'careerGuides');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  const categories = [];

  files.forEach(file => {
    const content = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    const id = file.replace('.json', '');
    
    let topic = 'Career Advice';
    const titleLower = content.seo.title.toLowerCase();
    if (titleLower.includes('data') || titleLower.includes('ai') || titleLower.includes('science') || titleLower.includes('intelligence')) {
      topic = 'Data & AI';
    } else if (titleLower.includes('software') || titleLower.includes('developer') || titleLower.includes('code') || titleLower.includes('prompt')) {
      topic = 'Development';
    } else if (titleLower.includes('resume') || titleLower.includes('ats')) {
      topic = 'Resume Tips';
    } else if (titleLower.includes('qa') || titleLower.includes('test') || titleLower.includes('automation')) {
      topic = 'QA & Testing';
    } else if (titleLower.includes('reliability') || titleLower.includes('sre') || titleLower.includes('cloud') || titleLower.includes('devops') || titleLower.includes('infrastructure')) {
      topic = 'Infrastructure';
    } else if (titleLower.includes('database') || titleLower.includes('dba') || titleLower.includes('admin')) {
      topic = 'Database';
    } else if (titleLower.includes('design') || titleLower.includes('product designer') || titleLower.includes('ux')) {
      topic = 'Design';
    }

    if (content.metadata && content.metadata.topic) {
      topic = content.metadata.topic;
    }

    // Calc read time
    let textContent = '';
    if (content.sections) {
      content.sections.forEach(s => {
        textContent += ' ' + (s.heading || '') + ' ' + (s.content || '');
      });
    }
    const readTime = getReadTime(textContent || JSON.stringify(content));

    categories.push({
      id,
      title: content.hero.title,
      description: content.seo.description,
      topic,
      readTime
    });
  });

  const indexContent = `export const careerGuideCategories = ${JSON.stringify(categories, null, 2)};\n`;
  fs.writeFileSync(path.join(dir, 'index.js'), indexContent, 'utf8');
  console.log(`✅ Rebuilt careerGuides/index.js with ${categories.length} entries`);
}

function rebuildSalaryGuides() {
  const dir = path.join(DATA_DIR, 'salaryGuides');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  const categories = [];

  files.forEach(file => {
    const content = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    const id = file.replace('.json', '');
    
    let role = 'Development';
    const titleLower = content.seo.title.toLowerCase();
    if (titleLower.includes('data') || titleLower.includes('science') || titleLower.includes('analyst') || titleLower.includes('scientist') || titleLower.includes('ai') || titleLower.includes('machine learning')) {
      role = 'Data & AI';
    } else if (titleLower.includes('devops') || titleLower.includes('reliability') || titleLower.includes('sre') || titleLower.includes('cloud') || titleLower.includes('database') || titleLower.includes('infrastructure')) {
      role = 'Infrastructure';
    } else if (titleLower.includes('product manager') || titleLower.includes('management') || titleLower.includes('business')) {
      role = 'Management';
    } else if (titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux')) {
      role = 'Design';
    } else if (titleLower.includes('cyber') || titleLower.includes('security')) {
      role = 'Security';
    } else if (titleLower.includes('qa') || titleLower.includes('test') || titleLower.includes('automation')) {
      role = 'QA & Testing';
    }

    if (content.metadata && content.metadata.role) {
      role = content.metadata.role;
    }

    let country = titleLower.includes('india') ? 'India' : 'USA';
    if (content.metadata && content.metadata.country) {
      country = content.metadata.country;
    }

    categories.push({
      id,
      title: content.hero.title,
      description: content.seo.description,
      role,
      country
    });
  });

  const indexContent = `export const salaryCategories = ${JSON.stringify(categories, null, 2)};\n`;
  fs.writeFileSync(path.join(dir, 'index.js'), indexContent, 'utf8');
  console.log(`✅ Rebuilt salaryGuides/index.js with ${categories.length} entries`);
}

function rebuildRoadmaps() {
  const dir = path.join(DATA_DIR, 'roadmaps');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  const categories = [];

  files.forEach(file => {
    const content = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    const id = file.replace('.json', '');
    
    let category = 'Development';
    const titleLower = content.seo.title.toLowerCase();
    if (titleLower.includes('data') || titleLower.includes('science') || titleLower.includes('analyst') || titleLower.includes('scientist') || titleLower.includes('ai') || titleLower.includes('machine learning') || titleLower.includes('llm')) {
      category = 'Data & AI';
    } else if (titleLower.includes('devops') || titleLower.includes('reliability') || titleLower.includes('sre') || titleLower.includes('cloud') || titleLower.includes('database') || titleLower.includes('infrastructure') || titleLower.includes('platform')) {
      category = 'Infrastructure';
    } else if (titleLower.includes('security') || titleLower.includes('hacker')) {
      category = 'Security';
    } else if (titleLower.includes('product manager') || titleLower.includes('management') || titleLower.includes('business')) {
      category = 'Management';
    } else if (titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux')) {
      category = 'Design';
    } else if (titleLower.includes('qa') || titleLower.includes('test') || titleLower.includes('automation')) {
      category = 'QA & Testing';
    }

    let difficulty = content.hero.difficultyLevel || 'Medium';
    let duration = content.hero.learningDuration || '6 Months';
    let salary = content.hero.averageSalary || '$110,000';
    let growth = content.hero.growthRate || '+20%';
    let isTrending = content.hero.isTrending || false;

    if (content.metadata) {
      if (content.metadata.category) category = content.metadata.category;
      if (content.metadata.difficulty) difficulty = content.metadata.difficulty;
      if (content.metadata.duration) duration = content.metadata.duration;
      if (content.metadata.salary) salary = content.metadata.salary;
      if (content.metadata.growth) growth = content.metadata.growth;
      if (content.metadata.isTrending !== undefined) isTrending = content.metadata.isTrending;
    }

    categories.push({
      id,
      title: content.hero.title,
      shortDescription: content.hero.shortDescription || content.seo.description,
      category,
      difficulty,
      duration,
      salary,
      growth,
      isTrending
    });
  });

  const indexContent = `export const roadmapList = ${JSON.stringify(categories, null, 2)};\n`;
  fs.writeFileSync(path.join(dir, 'index.js'), indexContent, 'utf8');
  console.log(`✅ Rebuilt roadmaps/index.js with ${categories.length} entries`);
}

function run() {
  try {
    rebuildResumeExamples();
    rebuildInterviewQuestions();
    rebuildCareerGuides();
    rebuildSalaryGuides();
    rebuildRoadmaps();
    console.log('🎉 All content indexes rebuilt successfully!');
  } catch (error) {
    console.error('❌ Error rebuilding indexes:', error);
    process.exit(1);
  }
}

run();
