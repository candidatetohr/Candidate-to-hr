import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (from server/.env)
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKeyString = process.env.NVIDIA_API_KEYS;
if (!apiKeyString) {
  console.error("No NVIDIA_API_KEYS found in server/.env");
  process.exit(1);
}

// Just use the first key
const apiKey = apiKeyString.split(',')[0].trim();
const baseURL = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";

// We will use Llama 3.3 70B Instruct for high quality JSON generation
const MODEL = "meta/llama-3.3-70b-instruct";

const TEMPLATES = {
  'career-guide': {
    examplePath: path.join(__dirname, '../../client/src/data/careerGuides/how-to-become-data-scientist.json'),
    outDir: path.join(__dirname, '../../client/src/data/careerGuides')
  },
  'roadmap': {
    examplePath: path.join(__dirname, '../../client/src/data/roadmaps/software-engineer.json'),
    outDir: path.join(__dirname, '../../client/src/data/roadmaps')
  },
  'interview': {
    examplePath: path.join(__dirname, '../../client/src/data/interviewQuestions/python.json'),
    outDir: path.join(__dirname, '../../client/src/data/interviewQuestions')
  },
  'resume': {
    examplePath: path.join(__dirname, '../../client/src/data/resumeExamples/data-scientist.json'),
    outDir: path.join(__dirname, '../../client/src/data/resumeExamples')
  },
  'salary': {
    examplePath: path.join(__dirname, '../../client/src/data/salaryGuides/data-scientist-india.json'),
    outDir: path.join(__dirname, '../../client/src/data/salaryGuides')
  }
};

async function generateJSON(type, slug, topic) {
  const templateInfo = TEMPLATES[type];
  if (!templateInfo) {
    console.error(`Invalid type: ${type}`);
    return;
  }

  const exampleRaw = fs.readFileSync(templateInfo.examplePath, 'utf8');
  const outPath = path.join(templateInfo.outDir, `${slug}.json`);

  if (fs.existsSync(outPath)) {
    console.log(`File already exists: ${outPath}. Skipping...`);
    return;
  }

  console.log(`Generating ${type} for "${topic}" (${slug}.json)...`);

  const prompt = `You are an expert tech career advisor and SEO writer.
I need you to generate a JSON file for my website following EXACTLY the schema of this example JSON.

THE SCHEMA MUST MATCH EXACTLY. DO NOT WRAP THE RESPONSE IN MARKDOWN BLOCKS (e.g. no \`\`\`json). RETURN ONLY RAW PARSABLE JSON.

Here is the example JSON structure you must copy (but replace the content with information for "${topic}"):

${exampleRaw}

Generate the new JSON for the topic: "${topic}". Ensure the "slug" property matches "${slug}". Keep the quality extremely high, professional, and accurate for 2026. Return strictly valid JSON.`;

  try {
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 4000,
      })
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }

    let content = data.choices[0].message.content.trim();
    
    // Clean up if the model wrapped it in markdown
    if (content.startsWith('```json')) {
      content = content.slice(7);
    }
    if (content.startsWith('```')) {
      content = content.slice(3);
    }
    if (content.endsWith('```')) {
      content = content.slice(0, -3);
    }

    // Verify it parses
    const parsed = JSON.parse(content);

    // Save
    if (!fs.existsSync(templateInfo.outDir)) {
      fs.mkdirSync(templateInfo.outDir, { recursive: true });
    }

    fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2));
    console.log(` Successfully generated ${slug}.json\n`);

  } catch (error) {
    console.error(` Failed to generate ${slug}.json: ${error.message}`);
  }
}

// Define the missing articles from the index.js files
const queue = [
  { type: 'career-guide', slug: 'how-to-become-software-engineer', topic: 'How to Become a Software Engineer (Self-Taught)' },
  { type: 'career-guide', slug: 'best-careers-after-btech-cse', topic: 'Best Careers After B.Tech CSE' },
  { type: 'career-guide', slug: 'skills-to-learn-in-2026', topic: 'Top 5 High-Income Skills to Learn in 2026' },
  
  { type: 'interview', slug: 'java', topic: 'Java Interview Questions' },
  { type: 'interview', slug: 'sql', topic: 'SQL Interview Questions' },
  { type: 'interview', slug: 'react', topic: 'React.js Interview Questions' },
  { type: 'interview', slug: 'data-science', topic: 'Data Science Interview Questions' },
  { type: 'interview', slug: 'system-design', topic: 'System Design Interview Questions' },
  
  { type: 'resume', slug: 'software-engineer', topic: 'Software Engineer Resume Example' },
  { type: 'resume', slug: 'product-manager', topic: 'Product Manager Resume Example' },
  { type: 'resume', slug: 'cyber-security', topic: 'Cyber Security Analyst Resume Example' },
  
  { type: 'salary', slug: 'software-engineer-india', topic: 'Software Engineer Salary in India (2026)' },
  { type: 'salary', slug: 'ai-engineer-india', topic: 'AI Engineer Salary in India (2026)' },
  { type: 'salary', slug: 'product-manager-us', topic: 'Product Manager Salary in USA (2026)' }
];

async function run() {
  console.log(`Starting generation queue (${queue.length} items)...\n`);
  for (const item of queue) {
    await generateJSON(item.type, item.slug, item.topic);
    // Wait 2 seconds to avoid rate limits
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log("All tasks completed!");
}

run();
