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
  { route: '/', title: 'CandidateToHR — Free AI Career Platform | Resume Analyzer & Interview Prep', desc: 'CandidateToHR is a free AI career platform. Analyze your resume, practice interviews with AI, explore 25+ career roadmaps, and get salary data — all powered by NVIDIA NIM. Start free.', type: 'WebPage' },
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

function getPreRenderedContent(route, title, desc, type, dataType, dataId, localCity) {
  let innerHtml = '';
  
  if (route === '/') {
    // Richer content for the homepage to satisfy Googlebot
    innerHtml = `
      <h1 style="font-size: 2.5rem; margin-bottom: 1rem; font-weight: 800; line-height: 1.2;">CandidateToHR: AI-Powered Resume &amp; Hiring Intelligence</h1>
      <p style="font-size: 1.25rem; color: #94a3b8; margin-bottom: 3rem; max-width: 800px; line-height: 1.6;">${desc}</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px;">
          <h2 style="font-size: 1.25rem; margin-bottom: 0.75rem;">AI Resume Analyzer</h2>
          <p style="color: #94a3b8; line-height: 1.5;">Get instant ATS scores, keyword optimization, and formatting feedback powered by advanced AI models. Make sure your resume passes the Applicant Tracking Systems.</p>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px;">
          <h2 style="font-size: 1.25rem; margin-bottom: 0.75rem;">Tech Career Roadmaps</h2>
          <p style="color: #94a3b8; line-height: 1.5;">Comprehensive, step-by-step guides to becoming a Software Engineer, Data Scientist, Product Manager, and more. Learn the exact skills, tools, and projects needed.</p>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px;">
          <h2 style="font-size: 1.25rem; margin-bottom: 0.75rem;">AI Interview Simulator</h2>
          <p style="color: #94a3b8; line-height: 1.5;">Practice with our voice-enabled AI interviewer. Get real-time feedback on your answers, tone, and confidence for behavioral and technical rounds.</p>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px;">
          <h2 style="font-size: 1.25rem; margin-bottom: 0.75rem;">Tech Salary Data</h2>
          <p style="color: #94a3b8; line-height: 1.5;">Explore real-time salary expectations, total compensation breakdowns, and negotiation strategies for top tech roles across major US cities.</p>
        </div>
      </div>
    `;
  } else {
    innerHtml = `
      <h1 style="font-size: 2.25rem; margin-bottom: 1rem; font-weight: 700;">${title}</h1>
      <p style="font-size: 1.125rem; color: #94a3b8; margin-bottom: 2rem;">${desc}</p>
    `;
  }

  innerHtml += `
    <hr style="border-color: rgba(255,255,255,0.1); margin: 2rem 0;" />
    <p style="color: #94a3b8;">CandidateToHR provides highly optimized, professional tech career resources. Build, customize, and analyze your tech career credentials completely free.</p>
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
  `;

  return `
    <div class="pre-rendered-seo" style="padding: 2rem; max-width: 1200px; margin: 0 auto; font-family: Inter, sans-serif; color: #f1f5f9; background: #111827; min-height: 100vh;">
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">
        <div style="width: 24px; height: 24px; background: #3b82f6; border-radius: 4px;"></div>
        <span style="font-size: 1.125rem; font-weight: 600;">CandidateToHR</span>
      </div>
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.1; pointer-events: none; text-align: center;">
        <div style="width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.2); border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
      </div>
      <div style="position: relative; z-index: 10;">
        ${innerHtml}
      </div>
    </div>
  `;
}

console.log(`Injecting SEO metadata for ${pages.length} routes...`);

let successCount = 0;

pages.forEach(({ route, title, desc, type, dataType, dataId, localCity }) => {
  try {
    const canonical = route === '/' ? DOMAIN : `${DOMAIN}${route}`;
    
    // Create specific JSON-LD schema
    let schemaObj = {};
    if (type === 'Organization' || (route === '/' && type === 'WebPage')) {
      // Homepage: use a WebPage schema that references the existing Organization
      // The authoritative Organization schema is already in the static index.html <head>
      schemaObj = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": `${DOMAIN}/#webpage`,
            "name": title,
            "url": DOMAIN,
            "description": desc,
            "isPartOf": { "@id": `${DOMAIN}/#website` },
            "about": { "@id": `${DOMAIN}/#organization` }
          },
          {
            "@type": "BreadcrumbList",
            "@id": `${DOMAIN}/#breadcrumb`,
            "itemListElement": [{
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": DOMAIN
            }]
          }
        ]
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
    
    // Inject pre-rendered semantic content directly inside the root div.
    // This provides an immediate DOM payload for Googlebot without relying on SPA JS hydration,
    // solving the empty root div indexing issue. React createRoot will overwrite this on load.
    const preRenderedContent = getPreRenderedContent(route, title, desc, type, dataType, dataId, localCity);
    
    // Replace the root div and its contents (including the default skeleton) with the SEO content
    newHtml = newHtml.replace(/<div id="root">[\s\S]*?<\/div>\s*<\/body>/i, `<div id="root">\n${preRenderedContent}\n</div>\n  </body>`);

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

// Copy index.html to 404.html so Vercel can serve it with a native 404 status code
const notFoundPath = path.join(distPath, '404.html');
fs.copyFileSync(baseHtmlPath, notFoundPath);
console.log(`✅ Generated 404.html fallback for Vercel soft-404 handling.`);
