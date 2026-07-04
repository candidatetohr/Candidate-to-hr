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
import { usTechHubs } from './src/data/locations.js';

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
  { route: '/', title: 'CandidateToHR — AI-Powered Applicant Tracking System & Career Hub', desc: 'CandidateToHR is an AI-powered career platform offering resume analysis, ATS optimization, interview preparation, salary guides, career roadmaps, skill gap analysis, and AI-powered job search tools.', type: 'Organization' },
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
    type: 'Article',
    dataType: 'roadmaps',
    dataId: item.id
  });
});

salaryCategories.forEach(item => {
  // Base category
  pages.push({
    route: `/salary-guides/${item.id}`,
    title: `${item.title} Salary Guide | CandidateToHR`,
    desc: item.shortDescription || item.description || `Learn about the salary expectations for ${item.title}.`,
    type: 'Article',
    dataType: 'salaryGuides',
    dataId: item.id
  });

  // Localized Categories
  usTechHubs.forEach(city => {
    let originalDesc = item.shortDescription || item.description || `Learn about the salary expectations for ${item.title}.`;
    let localizedDesc = originalDesc.replace(/in (the )?US(A)?|in India/gi, `in ${city.name}`);
    if (localizedDesc === originalDesc) {
      // If the regex didn't match, force append the city to ensure unique meta descriptions
      localizedDesc = `${originalDesc} Updated for ${city.name}.`;
    }

    pages.push({
      route: `/salary-guides/${item.id}-in-${city.slug}`,
      title: `${item.title} Salary Guide in ${city.name} | CandidateToHR`,
      desc: localizedDesc,
      type: 'Article',
      dataType: 'salaryGuides',
      dataId: item.id,
      localCity: city
    });
  });
});

interviewCategories.forEach(item => {
  pages.push({
    route: `/interview-questions/${item.id}`,
    title: `Top ${item.title} Interview Questions | CandidateToHR`,
    desc: item.shortDescription || item.description || `The most frequently asked interview questions for ${item.title}.`,
    type: 'FAQPage',
    dataType: 'interviewQuestions',
    dataId: item.id
  });
});

resumeCategories.forEach(item => {
  pages.push({
    route: `/resume-examples/${item.id}`,
    title: `${item.title} Resume Example | CandidateToHR`,
    desc: item.shortDescription || item.description || `An ATS-optimized resume template and example for ${item.title}.`,
    type: 'Article',
    dataType: 'resumeExamples',
    dataId: item.id
  });
});

careerGuideCategories.forEach(item => {
  pages.push({
    route: `/career-guides/${item.id}`,
    title: `${item.title} | Career Guide | CandidateToHR`,
    desc: item.shortDescription || item.description || `A definitive career guide on ${item.title}.`,
    type: 'Article',
    dataType: 'careerGuides',
    dataId: item.id
  });
});

// Helper to calculate string similarity for finding related topics if exact match fails
function getRelevanceScore(targetId, currentId) {
  if (!currentId) return 0;
  if (targetId === currentId) return 100;
  
  const targetWords = targetId.split('-');
  const currentWords = currentId.split('-');
  
  let score = 0;
  targetWords.forEach(word => {
    if (currentWords.includes(word) && word.length > 2) score += 10;
  });
  return score;
}

function getRelatedLinks(currentDataId) {
  const allLinks = [];
  pages.forEach(p => {
    // Skip static pages or pages without a dataId for the scoring
    if (!p.dataId) return;
    
    let score = getRelevanceScore(p.dataId, currentDataId);
    
    // Boost score if it's the exact same role in a different category (e.g., Roadmap -> Salary)
    if (p.dataId === currentDataId) score += 50;
    
    // If we are on a static page (no currentDataId), just show some random/top links
    if (!currentDataId) score = Math.random() * 20;

    allLinks.push({
      ...p,
      score
    });
  });

  // Sort by relevance score
  allLinks.sort((a, b) => b.score - a.score);

  // Take top 25
  return allLinks.slice(0, 25);
}

function getSemanticNoscriptContent(route, title, desc, type, dataType, dataId, localCity) {
  let innerHtml = `
    <h1>${title}</h1>
    <p>${desc}</p>
    <hr />
    <p>CandidateToHR provides highly optimized, professional tech career resources including: Resume Examples, Tech Career Roadmaps, Interview Prep questions and answers, and Career Guides. Build, customize, and analyze your tech career credentials completely free.</p>
  `;

  if (dataType && dataId) {
    try {
      const dataFilePath = path.join(__dirname, 'src', 'data', dataType, `${dataId}.json`);
      if (fs.existsSync(dataFilePath)) {
        const fileContent = fs.readFileSync(dataFilePath, 'utf8');
        let data = JSON.parse(fileContent);

        // Apply Local SEO Multiplier
        if (localCity && dataType === 'salaryGuides') {
          const multiplySalaryStr = (str) => {
            if (!str) return str;
            return str.replace(/\$([\d,]+)/g, (match, numStr) => {
              const num = parseInt(numStr.replace(/,/g, ''), 10);
              const scaled = Math.round((num * localCity.multiplier) / 1000) * 1000;
              return '$' + scaled.toLocaleString();
            });
          };

          const applyMultiplierToObj = (obj) => {
            if (typeof obj === 'string') {
              let newStr = obj.replace(/in (the )?US(A)?/gi, `in ${localCity.name}`);
              newStr = newStr.replace(/in India/gi, `in ${localCity.name}`);
              return multiplySalaryStr(newStr);
            }
            if (Array.isArray(obj)) {
              return obj.map(item => applyMultiplierToObj(item));
            }
            if (obj && typeof obj === 'object') {
              const newObj = {};
              for (const key in obj) {
                newObj[key] = applyMultiplierToObj(obj[key]);
              }
              return newObj;
            }
            return obj;
          };

          data = applyMultiplierToObj(data);
        }

        if (dataType === 'roadmaps') {
          innerHtml += `
            <h2>Career Overview</h2>
            <p><strong>What they do:</strong> ${data.overview?.whatTheyDo || ''}</p>
            <h3>Key Industries Hiring:</h3>
            <ul>
              ${(data.overview?.industriesHiring || []).map(ind => `<li>${ind}</li>`).join('')}
            </ul>
            <h3>Core Responsibilities:</h3>
            <ul>
              ${(data.overview?.responsibilities || []).map(resp => `<li>${resp}</li>`).join('')}
            </ul>
            
            <h2>Step-by-Step Learning Path</h2>
            ${(data.learningPath || []).map(step => `
              <h3>${step.month}</h3>
              <p>${step.description}</p>
            `).join('')}
            
            <h2>Skills &amp; Tools Mastery</h2>
            <h3>Beginner Skills:</h3>
            <ul>
              ${(data.skillsTimeline?.beginner || []).map(skill => `<li>${skill}</li>`).join('')}
            </ul>
            <h3>Intermediate Skills:</h3>
            <ul>
              ${(data.skillsTimeline?.intermediate || []).map(skill => `<li>${skill}</li>`).join('')}
            </ul>
            <h3>Advanced Skills:</h3>
            <ul>
              ${(data.skillsTimeline?.advanced || []).map(skill => `<li>${skill}</li>`).join('')}
            </ul>
            <h3>Essential Tools &amp; Technologies:</h3>
            <p>${(data.toolsAndTech || []).join(', ')}</p>
            
            <h2>Project Ideas to Build</h2>
            <h3>Beginner Projects:</h3>
            <ul>
              ${(data.projects?.beginner || []).map(p => `<li>${p}</li>`).join('')}
            </ul>
            <h3>Intermediate Projects:</h3>
            <ul>
              ${(data.projects?.intermediate || []).map(p => `<li>${p}</li>`).join('')}
            </ul>
            <h3>Advanced Projects:</h3>
            <ul>
              ${(data.projects?.advanced || []).map(p => `<li>${p}</li>`).join('')}
            </ul>
            
            <h2>Certifications to Pursue</h2>
            <ul>
              ${(data.certifications || []).map(c => `<li>${c}</li>`).join('')}
            </ul>
            
            <h2>Salary Insights</h2>
            <table>
              <thead>
                <tr>
                  <th>Experience Level</th>
                  <th>Average Salary Range</th>
                </tr>
              </thead>
              <tbody>
                ${(data.salaryInsights || []).map(s => `
                  <tr>
                    <td>${s.experience}</td>
                    <td>${s.salary}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <h2>Job Market &amp; Future Outlook</h2>
            <p><strong>Future Demand:</strong> ${data.jobMarket?.futureDemand || ''}</p>
            <p><strong>Remote Opportunities:</strong> ${data.jobMarket?.remoteOpportunities || ''}</p>
            
            <h2>Frequently Asked Questions</h2>
            ${(data.faq || []).map(f => `
              <h3>${f.q || ''}</h3>
              <p>${f.a || ''}</p>
            `).join('')}
          `;
        } else if (dataType === 'salaryGuides') {
          innerHtml += `
            <h2>Average Compensation</h2>
            <p>The average salary is <strong>${data.hero?.averageSalary || ''}</strong>.</p>
            <p>${data.hero?.description || ''}</p>
            
            <h2>Compensation by Experience Level</h2>
            <table>
              <thead>
                <tr>
                  <th>Experience Level</th>
                  <th>Salary Range</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                ${(data.experience || []).map(exp => `
                  <tr>
                    <td>${exp.level}</td>
                    <td>${exp.salary}</td>
                    <td>${exp.notes}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <h2>Salaries by Location / City</h2>
            <table>
              <thead>
                <tr>
                  <th>City / Hub</th>
                  <th>Average Salary</th>
                  <th>Premium vs Baseline</th>
                </tr>
              </thead>
              <tbody>
                ${(data.byCity || []).map(city => `
                  <tr>
                    <td>${city.city}</td>
                    <td>${city.salary}</td>
                    <td>${city.premium}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <h2>Top Paying Companies</h2>
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Total Compensation Range</th>
                  <th>Company Type</th>
                </tr>
              </thead>
              <tbody>
                ${(data.topCompanies || []).map(company => `
                  <tr>
                    <td>${company.company}</td>
                    <td>${company.salary}</td>
                    <td>${company.type}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <h2>Market Analysis</h2>
            <p>${typeof data.marketAnalysis === 'string' ? data.marketAnalysis : (data.marketAnalysis?.trends || '')}</p>
            ${data.marketAnalysis?.factors && Array.isArray(data.marketAnalysis.factors) ? `
              <ul>
                ${data.marketAnalysis.factors.map(factor => `<li>${factor}</li>`).join('')}
              </ul>
            ` : ''}
            
            <h2>Salary Negotiation Strategies</h2>
            ${data.negotiationTips && Array.isArray(data.negotiationTips) ? `
              <ul>
                ${data.negotiationTips.map(tip => `<li>${tip}</li>`).join('')}
              </ul>
            ` : `<p>${data.negotiationTips || ''}</p>`}
            
            <h2>Frequently Asked Questions</h2>
            ${(data.faq || []).map(f => `
              <h3>${f.q || ''}</h3>
              <p>${f.a || ''}</p>
            `).join('')}
          `;
        } else if (dataType === 'interviewQuestions') {
          innerHtml += `
            <p>${data.hero?.description || ''}</p>
            <h2>Top Interview Questions &amp; Answers</h2>
            
            ${data.questions?.beginner ? `
              <h3>Beginner Interview Questions</h3>
              <dl>
                ${data.questions.beginner.map(q => `
                  <dt><strong>Q: ${q.q || ''}</strong></dt>
                  <dd>A: ${q.a || ''}</dd>
                `).join('')}
              </dl>
            ` : ''}
            
            ${data.questions?.intermediate ? `
              <h3>Intermediate Interview Questions</h3>
              <dl>
                ${data.questions.intermediate.map(q => `
                  <dt><strong>Q: ${q.q || ''}</strong></dt>
                  <dd>A: ${q.a || ''}</dd>
                `).join('')}
              </dl>
            ` : ''}
            
            ${data.questions?.advanced ? `
              <h3>Advanced Interview Questions</h3>
              <dl>
                ${data.questions.advanced.map(q => `
                  <dt><strong>Q: ${q.q || ''}</strong></dt>
                  <dd>A: ${q.a || ''}</dd>
                `).join('')}
              </dl>
            ` : ''}
            
            <h2>Frequently Asked Questions</h2>
            ${(data.faq || []).map(f => `
              <h3>${f.q || ''}</h3>
              <p>${f.a || ''}</p>
            `).join('')}
          `;
        } else if (dataType === 'resumeExamples') {
          innerHtml += `
            <p>${data.hero?.description || ''}</p>
            <h2>Resume Quality Score</h2>
            <p><strong>Target ATS Score:</strong> ${data.score?.atsScore || 95}/100 | <strong>Readability:</strong> ${data.score?.readability || 'High'}</p>
            
            <h2>Top Keywords &amp; Skills for Resume</h2>
            <p>${(data.keywords || []).join(', ')}</p>
            
            <h2>Common Resume Mistakes to Avoid</h2>
            <ul>
              ${(data.mistakes || []).map(m => `<li>${m}</li>`).join('')}
            </ul>
            
            <h2>Pro Resume Writing Tips</h2>
            <ul>
              ${(data.tips || []).map(t => `<li>${t}</li>`).join('')}
            </ul>
            
            <h2>Complete Resume Sample</h2>
            <div style="border: 1px solid #ccc; padding: 1.5rem; margin-top: 1rem;">
              <h3>${data.exampleResume?.name || ''} - ${data.exampleResume?.title || ''}</h3>
              <p>${data.exampleResume?.summary || ''}</p>
              <h4>Core Experience:</h4>
              ${(data.exampleResume?.experience || []).map(exp => `
                <p><strong>${exp.role}</strong> at ${exp.company} (${exp.date})</p>
                <ul>
                  ${(exp.bullets || []).map(b => `<li>${b}</li>`).join('')}
                </ul>
              `).join('')}
              <h4>Skills:</h4>
              <p>${data.exampleResume?.skills || ''}</p>
              <h4>Education:</h4>
              ${(data.exampleResume?.education || []).map(edu => `
                <p>${edu.degree} - ${edu.school} (${edu.date})</p>
              `).join('')}
              <h4>Certifications:</h4>
              <ul>
                ${(data.exampleResume?.certifications || []).map(c => `<li>${c}</li>`).join('')}
              </ul>
              <h4>Key Projects:</h4>
              ${(data.exampleResume?.projects || []).map(p => `
                <p><strong>${p.name}:</strong> ${p.description}</p>
              `).join('')}
            </div>
            
            <h2>Expert Content Breakdown</h2>
            ${(data.extendedContent || []).map(section => `
              <h3>${section.heading}</h3>
              <p>${section.content}</p>
            `).join('')}
            
            <h2>Frequently Asked Questions</h2>
            ${(data.faq || []).map(f => `
              <h3>${f.q || ''}</h3>
              <p>${f.a || ''}</p>
            `).join('')}
          `;
        } else if (dataType === 'careerGuides') {
          innerHtml += `
            <p>${data.hero?.description || ''}</p>
            
            ${(data.sections || []).map(section => `
              <h2>${section.heading}</h2>
              <p>${section.content}</p>
            `).join('')}
            
            <h2>Frequently Asked Questions</h2>
            ${(data.faq || []).map(f => `
              <h3>${f.q || ''}</h3>
              <p>${f.a || ''}</p>
            `).join('')}
          `;
        }
      }
    } catch (e) {
      console.error(`Failed to generate full noscript content for ${route}:`, e);
    }
  }

  const relatedLinks = getRelatedLinks(dataId);
  
  innerHtml += `
    <hr />
    <h2>Related Resources & Next Steps</h2>
    <ul>
      ${relatedLinks.map(p => `<li><a href="${DOMAIN}${p.route}">${p.title}</a></li>`).join('')}
    </ul>
    <div style="display:none;" aria-hidden="true"><h2>The Ultimate Guide to Tech Career Roadmaps in 2026</h2><h3>Why Specialized Roadmaps Are Essential for Modern Tech Careers</h3><p>In the rapidly evolving landscape of the technology sector, the concept of a generic "computer science" career path has become entirely obsolete. As we move deeper into 2026, the industry has splintered into highly specialized, hyper-focused sub-domains. An engineer focusing on distributed systems architecture requires a fundamentally different foundational knowledge base than an engineer focused on front-end micro-interactions or machine learning operations (MLOps). This fragmentation makes generalized advice not just unhelpful, but actively detrimental to career progression.

Our comprehensive career roadmaps are designed to solve this exact problem. By breaking down complex career trajectories into sequential, actionable nodes, we provide a deterministic path from novice to principal-level expertise. A well-structured roadmap eliminates the 'paradox of choice' that paralyzes so many junior developers. Instead of wondering whether to learn Rust, Go, or Python next, a specialized roadmap dictates the optimal sequencing based on current market demands, hiring trends, and historical salary data. Furthermore, these roadmaps are not static documents; they are living blueprints that adapt to the introduction of new frameworks, the deprecation of old standards, and the macro-economic shifts in global hiring patterns.</p><h3>The Transition from Tactical to Strategic Skill Acquisition</h3><p>A critical inflection point in any tech career occurs when a professional transitions from tactical execution to strategic architecture. In the early stages of a career, learning is inherently tactical: memorizing syntax, understanding basic design patterns, and learning how to deploy code to a server. Our beginner-tier roadmap nodes are specifically designed to accelerate this phase through high-repetition, project-based learning.

However, as a professional approaches the mid-to-senior levels, the roadmaps shift focus dramatically. The nodes move away from 'how to write a for-loop' and toward 'how to design a system that can handle 10,000 concurrent writes per second without data corruption.' This strategic phase requires a completely different pedagogical approach. Our advanced roadmap sections emphasize system design, trade-off analysis (e.g., CAP theorem constraints), cross-functional leadership, and deep observability. By explicitly mapping out these strategic competencies, our roadmaps ensure that professionals do not get trapped in a perpetual cycle of learning new syntax, but rather elevate their fundamental engineering maturity.</p><h3>The Role of AI and Automation in Career Planning</h3><p>No career planning tool in 2026 can ignore the massive, disruptive impact of Artificial Intelligence and Large Language Models (LLMs). The integration of AI into the daily workflow of knowledge workers has fundamentally altered what skills are considered valuable. Rote memorization of APIs and standard boilerplate generation are now entirely commoditized by AI assistants like GitHub Copilot and Claude. 

Our roadmaps have been rigorously updated to reflect this new reality. We have deprecated roadmap nodes that focus heavily on rote memorization and replaced them with nodes focused on AI orchestration, prompt engineering, and the validation of AI-generated architectures. A modern technology professional must view AI not as a replacement, but as an exoskeleton that amplifies their capabilities. The roadmaps explicitly detail how to integrate these AI tools into standard CI/CD pipelines, how to use them for advanced debugging, and how to leverage them to accelerate the mastery of new domains. Professionals who follow these AI-augmented paths are finding that their time-to-competency is cut in half compared to traditional learning methods.</p><h3>Navigating the Economics of Tech Careers: Salary and Equity</h3><p>Understanding the technical requirements of a role is only half of the equation; understanding the economic realities of that role is equally important. Our roadmaps are tightly integrated with real-time salary data and compensation trends. We recognize that career progression is not solely about intellectual fulfillment, but also about maximizing earning potential and achieving financial independence.

We break down the financial trajectory of each specialized role, detailing not just the base salary expectations, but also the nuances of equity compensation (RSUs vs. Options), sign-on bonuses, and annual refreshers. We provide historical context on how compensation bands for specific roles (e.g., Data Engineering vs. Web Development) have expanded or contracted over the last five years. This economic data empowers professionals to make highly strategic decisions about their career pivots. For instance, if the roadmap data indicates a massive surge in demand and compensation for Cloud Security Architects, a mid-level backend engineer can use the roadmap to systematically bridge their skill gap and transition into that highly lucrative specialization.</p><h3>Building a Portfolio That Proves Competence</h3><p>The final, and perhaps most crucial, component of our comprehensive roadmaps is the emphasis on proof-of-competence over credentialism. In the modern tech hiring landscape, a traditional degree is increasingly viewed as a weak signal compared to a robust, publicly verifiable portfolio of complex projects. Our roadmaps do not just tell you what to learn; they tell you exactly what to build to prove that you have learned it.

For every major node in our roadmaps, we provide specialized, domain-specific project ideas that go far beyond standard "to-do list" applications. We challenge users to build distributed consensus algorithms, high-throughput message queues, and responsive, accessible user interfaces that pass rigorous web-vital audits. By the time a professional completes one of our roadmaps, they will have generated a GitHub profile that serves as undeniable proof of their seniority and technical depth. This project-first approach is the single most effective strategy for bypassing traditional ATS screens and securing interviews at top-tier technology companies.</p><h2>The Definitive Guide to Tech Compensation and Negotiation</h2><h3>Understanding Total Compensation (TC) in Modern Tech</h3><p>The concept of a "salary" is dangerously incomplete in the modern technology industry. When evaluating career opportunities, professionals must think strictly in terms of Total Compensation (TC). TC is a multifaceted financial package that extends far beyond the guaranteed bi-weekly paycheck. It typically consists of three primary pillars: Base Salary, Equity (RSUs or Stock Options), and Bonuses (Sign-on, Annual Performance, and Retention).

Base salary provides financial stability and determines your minimum lifestyle baseline, but it is rarely the vehicle for significant wealth creation. The true financial leverage in a tech career comes from equity. Understanding the difference between Restricted Stock Units (RSUs) offered by public tech giants (FAANG/MAMAA) and Incentive Stock Options (ISOs) offered by early-stage startups is the single most important financial education a tech worker can acquire. RSUs represent nearly liquid cash that vests over a standard four-year cliff schedule, whereas ISOs represent a high-risk, high-reward lottery ticket tied to a future liquidity event (IPO or acquisition). Our salary guides break down these components meticulously, ensuring you understand exactly how your TC is structured and where the hidden risks lie.</p><h3>The Psychology and Strategy of Salary Negotiation</h3><p>Negotiation is not a combative process; it is a collaborative business discussion designed to align the value you bring to the organization with their compensation bands. The biggest mistake technical professionals make is accepting the initial offer without a counter. In almost all circumstances, the initial offer represents the 25th to 50th percentile of the approved budget for that specific headcount. The recruiter's job is to secure the talent as efficiently as possible; your job is to maximize your leverage.

The foundation of any successful negotiation is leverage, and the most powerful form of leverage is a competing offer. However, even without a competing offer, you can manufacture leverage through data. By utilizing our comprehensive salary guides, you can anchor your counter-offer to verified market data for your specific geographic tier and experience level. When countering, it is crucial to remain enthusiastic about the role while remaining firm on the numbers. A phrase like, "I am incredibly excited to join the team, but based on my market research and the specialized skills I bring to this architecture, I would need a base of $X and equity of $Y to sign today," completely shifts the dynamic of the conversation.</p><h3>Geographic Arbitrage and Remote Work Compensation</h3><p>The shift toward distributed, remote-first work models has created unprecedented opportunities for geographic arbitrage. Historically, tech compensation was inextricably linked to the cost of living in major hubs like San Francisco, New York, or London. If you wanted top-tier compensation, you had to endure top-tier housing costs. Today, the landscape is much more complex, and our salary guides reflect these geographic nuances.

Companies generally fall into one of three compensation philosophies regarding remote work. The first is "Location-Agnostic" pay, where companies pay San Francisco rates regardless of where the employee lives (e.g., Reddit, Airbnb). The second is "Tiered Geographic" pay, where salaries are localized based on the cost of labor in specific zones (e.g., Google, Meta). The third is "National Average" pay. Understanding which philosophy a prospective employer utilizes is critical. A developer living in a low-cost-of-living (LCOL) area who secures a role at a location-agnostic company achieves extreme geographic arbitrage, effectively doubling their disposable income compared to living in a coastal hub.</p><h3>The Impact of Seniority and Title Deflation</h3><p>A common pitfall in tech compensation analysis is focusing too heavily on the job title rather than the internal leveling system. A "Senior Software Engineer" at a local non-tech enterprise is entirely different from a "Senior Software Engineer" (Level 5) at Google, both in terms of expectations and compensation. This discrepancy leads to what is known as "Title Deflation" when transitioning from lower-tier to higher-tier companies.

When utilizing our salary guides, it is essential to map your skills to the *competencies* of the role, not just the title. Transitioning to a top-tier tech company often requires accepting a "lower" title (e.g., moving from Staff Engineer at a startup to Mid-Level Engineer at Amazon). However, because of the radically different compensation bands, this "demotion" in title frequently results in a massive 50% to 100% increase in Total Compensation. Our guides demystify these leveling structures (L3, L4, L5, L6, etc.) so you can accurately benchmark where you stand in the broader market hierarchy.</p><h3>Macro-Economic Trends and Future Earning Potential</h3><p>Compensation in the tech industry is highly elastic and incredibly sensitive to macro-economic conditions. The zero-interest-rate phenomenon (ZIRP) of the late 2010s and early 2020s led to unprecedented salary bloat and massive hiring sprees. However, as interest rates normalized, the industry saw significant corrections, layoffs, and a tightening of compensation bands for entry-level and mid-level roles. 

Looking forward to 2026 and beyond, we are seeing a clear bifurcation in the market. Compensation for generalized, commodity engineering skills (basic web development, simple CRUD application building) is stagnating or compressing due to global outsourcing and AI-assisted coding tools. Conversely, compensation for highly specialized, high-leverage roles—such as AI Infrastructure Engineers, Distributed Systems Architects, and Security Researchers—is accelerating rapidly. The key to maintaining high earning potential in this new era is continuous upskilling into these high-complexity domains. Our salary guides serve as a lagging indicator of these macro trends, showing you exactly where the capital is flowing so you can position your career accordingly.</p><h2>Navigating the Tech Industry: From Junior to Principal</h2><h3>The Myth of the Linear Career Progression</h3><p>One of the most pervasive myths in the technology industry is that career progression is a linear, predictable ladder. Many entrants assume they will progress smoothly from Junior to Mid-Level, to Senior, to Staff, and finally to Principal over a set number of years. In reality, the modern tech career is highly non-linear, characterized by lateral moves, paradigm shifts, and periodic complete reinventions of one's skill set.

The velocity of technological change means that the stack you master in year one of your career may be entirely obsolete by year five. Therefore, the most valuable meta-skill you can develop is not mastery of a specific language like Python or Java, but rather the ability to learn complex technical concepts rapidly and apply them to novel problems. Our career guides emphasize this adaptability. We focus heavily on foundational computer science principles, system design methodologies, and architectural patterns because these concepts remain invariant regardless of the underlying syntax or framework currently en vogue.</p><h3>Surviving the "Mid-Level Plateau"</h3><p>A significant percentage of tech professionals experience what is known as the "Mid-Level Plateau." Moving from Junior to Mid-Level is relatively straightforward; it requires demonstrating the ability to execute well-defined tasks independently, write clean code, and understand the core business logic of the application. However, moving from Mid-Level to Senior is an entirely different challenge. 

The transition to Senior requires a paradigm shift from "execution" to "ownership and influence." A Mid-Level engineer asks, "How do I build this feature?" A Senior engineer asks, "Should we build this feature at all? What are the edge cases? How will this impact database latency? Have we considered the security implications?" Breaking out of the plateau requires actively seeking out ambiguity. You must volunteer to lead complex, poorly defined projects, mentor junior developers, and establish cross-team technical standards. Our career guides provide explicit frameworks for identifying these high-leverage opportunities within your organization and using them to demonstrate the scope and impact required for promotion.</p><h3>The Fork in the Road: Management vs. Individual Contributor (IC)</h3><p>Historically, the only path to increased compensation and influence in the corporate world was to move into people management. The technology industry is unique in that it offers a parallel, highly lucrative track for Individual Contributors (ICs). At a certain point in your career (usually at the Senior level), you will face a critical fork in the road: do you want to manage systems, or do you want to manage people?

It is crucial to understand that Engineering Management is not a promotion; it is a completely different profession. The skills that made you a brilliant engineer—deep focus, technical pedantry, and logic—are often detrimental in management, which requires immense emotional intelligence, conflict resolution, and organizational politics. The Staff/Principal IC track allows you to scale your technical impact across multiple teams without taking on direct reports. You become a technical visionary and an architectural guide. Our career guides meticulously detail the day-to-day realities of both tracks, helping you align your natural disposition and career goals with the correct trajectory.</p><h3>Building a Durable Professional Brand</h3><p>In an increasingly competitive global talent market, relying solely on a resume and a LinkedIn profile is insufficient for reaching the highest echelons of the industry. Top-tier opportunities—such as founding engineer roles at well-funded startups or Staff-level positions at FAANG—are rarely posted on standard job boards; they are filled through networks and reputation. Building a durable professional brand is a critical component of long-term career success.

This does not mean you need to become a social media influencer. It means you must establish a public track record of technical excellence. This is achieved by contributing to significant open-source projects, writing deeply technical blog posts detailing complex architectural challenges you've solved, or speaking at respected industry conferences. By externalizing your knowledge, you transition from an "unknown applicant" to a "known entity." When recruiters or engineering leaders search for expertise in your specific niche, your content should serve as a magnet, drawing inbound opportunities directly to you.</p><h3>Avoiding Burnout and Optimizing for Longevity</h3><p>The technology industry is notorious for its intense pace, aggressive deadlines, and high potential for burnout. The cognitive load required to hold complex distributed systems in your mind, combined with the pressure of on-call rotations and production incidents, takes a severe toll on mental health. A career guide is incomplete if it only discusses how to climb the ladder, without discussing how to survive the climb.

Optimizing for longevity requires treating your career as a marathon, not a sprint. This means setting rigid boundaries around your working hours, aggressively disconnecting during evenings and weekends, and treating your physical health as a prerequisite for intellectual performance. Furthermore, it involves choosing employers who respect psychological safety and possess mature engineering cultures where blameless post-mortems are the norm. If you find yourself in a toxic environment characterized by hero-worship and constant fire-fighting, the most strategic career move you can make is to leave. No amount of compensation or equity is worth the long-term degradation of your cognitive capacity.</p><h2>Cracking the Modern Tech Interview: System Design, LeetCode, and Behavioral</h2><h3>The Evolution of the Technical Interview Process</h3><p>The modern technical interview process has evolved into a rigorous, multi-stage gauntlet designed to filter out false positives at all costs. Over the past decade, the process has standardized heavily around a few core pillars: Data Structures and Algorithms (DSA/LeetCode), System Design and Architecture, Domain-Specific Trivia, and Behavioral/Leadership profiling. To succeed in this environment, candidates must view interview preparation not as a casual review, but as a dedicated, systematic study program akin to preparing for a standardized exam.

The reliance on abstract algorithmic puzzles has been widely criticized, but it remains the de facto gatekeeping mechanism for almost all top-tier technology companies. The rationale is that if a candidate possesses the raw analytical horsepower and dedication required to master dynamic programming and graph traversals, they can likely learn whatever proprietary frameworks the company uses. However, as AI tools become increasingly proficient at generating perfect algorithmic solutions, we are seeing a macro-shift in interview focus. The emphasis is moving heavily toward System Design and deep architectural discussions, as these evaluate a candidate's ability to reason about ambiguity, scale, and trade-offs—skills that current AI models struggle to replicate.</p><h3>Mastering Data Structures and Algorithms (The LeetCode Grind)</h3><p>For better or worse, algorithmic proficiency is the absolute prerequisite for passing the technical phone screen and initial onsite rounds. The biggest mistake candidates make during "The LeetCode Grind" is optimizing for quantity over quality. Memorizing the solutions to 500 random problems is highly inefficient and brittle; if the interviewer slightly modifies the constraints of a problem, memorization fails.

The correct approach is pattern recognition. There are roughly 15 core algorithmic patterns that cover 90% of all interview questions: Sliding Window, Two Pointers, Fast & Slow Pointers, Merge Intervals, Cyclic Sort, In-place Reversal of a LinkedList, Tree BFS/DFS, Two Heaps, Subsets, Modified Binary Search, Top 'K' Elements, K-way Merge, and Topological Sort. Your goal is to deeply internalize these patterns. When presented with a novel problem, you shouldn't be searching your memory for the exact answer; you should be analyzing the input data structure and constraints to immediately identify which of the 15 patterns applies. During the interview, vocalize your thought process continuously. A sub-optimal solution clearly communicated is often graded higher than an optimal solution written in complete silence.</p><h3>Deconstructing the System Design Interview</h3><p>While DSA tests your micro-level coding ability, the System Design interview tests your macro-level engineering maturity. This is the round that typically determines your leveling (e.g., Mid-level vs. Senior) and, consequently, your compensation band. The System Design interview is deliberately ambiguous and open-ended. If an interviewer asks you to "Design Twitter," they do not want a detailed schema of the user table; they want to see how you handle massive scale, distributed data, and network latency.

A successful System Design interview follows a strict, repeatable framework. 1) Requirements Clarification: Explicitly define the functional (what it does) and non-functional (scale, latency, availability) constraints. 2) Back-of-the-envelope Estimation: Calculate expected QPS (Queries Per Second), storage requirements, and network bandwidth to justify your architectural choices. 3) High-Level Design: Draw the core components (Client, Load Balancer, Web Servers, Database). 4) Deep Dive: Identify the bottlenecks. If it's a read-heavy system like Twitter, explain how you will use a Redis caching layer, CDN for media, and a fan-out-on-write architecture for celebrity feeds. You must preemptively discuss trade-offs: why did you choose Cassandra (Availability) over PostgreSQL (Consistency)? Mastery of trade-offs is the hallmark of a Senior engineer.</p><h3>The STAR Method and Behavioral Profiling</h3><p>Many brilliant technical candidates fail the interview process because they vastly underestimate the importance of the behavioral round. Companies like Amazon (with their Leadership Principles) and Meta place massive emphasis on cultural fit and conflict resolution. The interviewer is trying to determine three things: Are you easy to work with? Can you handle critical feedback? Do you take extreme ownership of your failures?

Every behavioral response must be structured using the STAR method: Situation (set the context), Task (what was the challenge), Action (what specific steps did *you* take), and Result (what was the measurable business impact). The most common mistake is using the pronoun "we" instead of "I". The interviewer is hiring *you*, not your team. Prepare a matrix of 5-7 deeply detailed stories from your past experience that can be adapted to answer any question about conflict, failure, tight deadlines, or technical disagreement. When discussing failures, never deflect blame. Take extreme ownership, explain what went wrong, and critically, explain the systemic changes you implemented to ensure the failure never occurred again.</p><h3>The Psychology of the Interview: Managing Stress and Imposter Syndrome</h3><p>The technical interview is as much a test of psychological resilience as it is a test of engineering skill. Writing code on a whiteboard or in a shared text editor while a senior engineer silently judges your every keystroke induces massive cognitive load and anxiety. This environment often triggers severe Imposter Syndrome, causing otherwise highly competent developers to freeze, blank out on basic syntax, or spiral into panic when they encounter a bug.

Managing this psychological pressure requires deliberate practice. Conduct mock interviews with peers or via platforms like Pramp to desensitize yourself to the high-pressure environment. Treat the interviewer not as an adversary trying to trick you, but as a pair-programming partner. If you get stuck, do not panic and do not stay silent. Ask clarifying questions, state your assumptions, and explain where your logic is failing. Interviewers want to see how you react when you don't know the answer immediately, because in the real world, you will constantly face problems you don't immediately know how to solve. Confidence, humility, and clear communication under pressure are the ultimate signals of a high-tier professional.</p><h2>Optimizing Your Job Search Arsenal in 2026</h2><h3>The Science of the Modern ATS Resume</h3><p>In the modern hiring landscape, your resume is rarely read by a human being during the initial screening phase. It is parsed, indexed, and ranked by highly sophisticated Applicant Tracking Systems (ATS) powered by NLP (Natural Language Processing). Therefore, your resume must be engineered to pass a machine readability test before it is ever evaluated for human narrative. The biggest mistake candidates make is using overly complex, heavily designed, multi-column templates that shatter the ATS parsing logic.

A machine-readable resume is ruthlessly simple: a single column, standard sans-serif fonts, and clear, hierarchical section headers (Experience, Education, Skills). But formatting is only the baseline. The true science lies in keyword optimization. ATS systems rank candidates based on semantic similarity to the job description. You must meticulously tailor your skills section and bullet points to mirror the exact terminology used by the employer. If the job description asks for "AWS EC2," do not write "Amazon Cloud Compute." You must feed the algorithm exactly what it is searching for, establishing undeniable relevance before a recruiter ever lays eyes on your document.</p><h3>Writing Impact-Driven Bullet Points</h3><p>Once your resume bypasses the ATS and reaches a human recruiter, you have approximately 6 to 10 seconds to establish competence. Recruiters do not read resumes; they scan them for impact. Most candidates write their experience sections like a list of chores: "Responsible for managing the database," or "Wrote code in Java." This is entirely ineffective because it describes the *activity*, not the *result*.

Every single bullet point on your resume must follow a strict XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]." For example, instead of "Improved database speed," write "Reduced API latency by 45% (X), resulting in a 20% increase in user retention (Y), by implementing a Redis caching layer and optimizing complex SQL joins (Z)." You must quantify your impact with hard numbers, percentages, and dollar amounts. Numbers jump off the page and provide immediate, objective proof of your seniority and business value. If you cannot quantify the exact metric, quantify the scale of the system you worked on (e.g., "handled 10 million daily active users").</p><h3>Decoding Rejections and Maintaining Resilience</h3><p>The job search process is inherently a numbers game, and rejection is an unavoidable mathematical certainty. Even highly qualified candidates at the Staff and Principal levels experience rejection rates exceeding 80%. The danger of the job search is not the rejection itself, but the psychological toll it takes, which can lead to desperation, burnout, and a degradation in interview performance.

It is crucial to decode rejections objectively rather than internalizing them as a reflection of your self-worth. If you are applying to 100 jobs and getting 0 interviews, your resume is failing the ATS screen. If you are getting 10 phone screens but 0 onsites, your communication or behavioral skills need refinement. If you are failing at the onsite stage, you are likely failing the System Design or advanced algorithmic rounds. By treating the job search as an engineering problem—isolating the bottleneck in your funnel and optimizing that specific node—you strip the emotion out of the process. Maintain resilience by detaching from the outcome of any single interview and focusing entirely on the volume and quality of your pipeline.</p><h3>Leveraging AI for Interview Preparation</h3><p>The emergence of sophisticated AI models has revolutionized how candidates prepare for interviews. You no longer need to rely on expensive human coaches to conduct mock interviews or review your resume. AI tools can simulate the exact pressure and unpredictability of a real technical interview with astonishing accuracy.

You can use AI to ingest a specific job description and generate highly tailored behavioral and technical questions that are statistically likely to be asked. You can paste your resume into an LLM and ask it to adopt the persona of a ruthless hiring manager and tear apart your bullet points for lack of impact. Furthermore, you can use AI to conduct simulated System Design interviews, asking it to critique your architectural choices and prompt you with edge cases (e.g., "How would your design handle a sudden regional data center failure?"). Integrating AI into your preparation loop allows for infinite, high-fidelity practice iterations.</p><h3>The Hidden Job Market and Networking Velocity</h3><p>While optimizing your resume and interview skills is essential, the most lucrative and highly sought-after roles are rarely filled through cold applications on standard job boards. They are filled through the "Hidden Job Market"—roles that are filled via internal referrals, professional networks, and direct headhunting before they are ever publicly listed. Relying solely on cold applications is the lowest-probability strategy for career advancement.

To tap into the hidden job market, you must increase your "Networking Velocity." This involves consistently reaching out to engineering managers, recruiters, and peers in your target companies for informational interviews. It involves contributing to open-source projects where you interact directly with senior engineers from top-tier firms. It means actively publishing technical content (blogs, system design teardowns) that acts as a beacon, drawing recruiters to you. A single internal referral from a respected engineer bypasses the entire ATS black hole and guarantees that your resume is placed directly on the hiring manager's desk. Networking is not about transactional favors; it is about building a long-term web of professional goodwill.</p></div>
  `;

  return `
    <noscript>
      <div class="noscript-seo-summary" style="padding: 2rem; max-width: 800px; margin: 0 auto;">
        ${innerHtml}
      </div>
    </noscript>
  `;
}

console.log(`Injecting SEO metadata for ${pages.length} routes...`);

let successCount = 0;

pages.forEach(({ route, title, desc, type, dataType, dataId, localCity }) => {
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

    // Strip default OG and Twitter tags to prevent duplicates
    let cleanHtml = baseHtml
      .replace(/<meta\s+(?:property|name)=["']og:[^"']+["']\s+content=["'][^"']*["']\s*\/?>/gis, '')
      .replace(/<meta\s+(?:property|name)=["']twitter:[^"']+["']\s+content=["'][^"']*["']\s*\/?>/gis, '')
      .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/gis, '');

    // Replace Title & Meta Description & Inject Canonical and Schema
    let newHtml = cleanHtml
      .replace(/<title>.*?<\/title>/is, `<title>${title}</title>`)
      .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/is, `<meta name="description" content="${desc}" />`);
    
    // Also inject Open Graph tags and Canonical into head
    const ogTags = `
      <link rel="canonical" href="${canonical}" />
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${desc}" />
      <meta property="og:url" content="${canonical}" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="${DOMAIN}/og-image.png" />
      <meta property="og:site_name" content="CandidateToHR" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${desc}" />
      <meta name="twitter:image" content="${DOMAIN}/og-image.png" />
    `;
    
    newHtml = newHtml.replace('</head>', `${ogTags}\n${schemaString}\n</head>`);
    
    // Inject semantic content summary inside noscript to assist search engine indexing of SPA pages without affecting hydration
    const noscriptContent = getSemanticNoscriptContent(route, title, desc, type, dataType, dataId, localCity);
    
    newHtml = newHtml.replace('<div id="root"></div>', `<div id="root"></div>\n${noscriptContent}`);

    // Ensure the folder and file are created correctly
    const isHome = route === '/';
    let targetFile;
    if (isHome) {
      targetFile = path.join(distPath, 'index.html');
    } else {
      // Save as flat .html file (e.g. roadmaps/llm-developer.html)
      const relativePath = route.slice(1) + '.html';
      targetFile = path.join(distPath, relativePath);
      const parentDir = path.dirname(targetFile);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
    }

    fs.writeFileSync(targetFile, newHtml);
    
    successCount++;
  } catch (err) {
    console.error(`❌ Failed to inject SEO for ${route}:`, err.message);
  }
});

console.log(`✅ Successfully injected SEO metadata for ${successCount}/${pages.length} routes.`);
