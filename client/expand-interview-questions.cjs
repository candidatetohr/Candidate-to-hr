/**
 * expand-interview-questions.cjs
 * Bulk-expands all interview question JSON files to ensure they have thick E-E-A-T content.
 * Adds more detailed answers, deep dives, and behavioral sections.
 * Run: node expand-interview-questions.cjs
 */

const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'src/data/interviewQuestions');

function getRoleName(slug) {
  let name = slug.replace('how-to-become-', '').replace('-roadmap-2026', '');
  return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.json') && f !== 'index.js');
let expanded = 0;

files.forEach(filename => {
  const filePath = path.join(DIR, filename);
  const slug = filename.replace('.json', '');
  const roleName = getRoleName(slug);
  
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.log('  ERROR parsing:', slug, e.message);
    return;
  }
  
  // Enhance categories with a behavioral and system design / architecture category if they don't have it
  if (data.categories && Array.isArray(data.categories)) {
    const hasBehavioral = data.categories.some(c => c.name.toLowerCase().includes('behavioral'));
    const hasSystemDesign = data.categories.some(c => c.name.toLowerCase().includes('system design') || c.name.toLowerCase().includes('architecture'));

    if (!hasBehavioral) {
      data.categories.push({
        name: 'Behavioral & Leadership',
        description: `Questions designed to assess your soft skills, teamwork, and past experiences as a ${roleName}.`,
        questions: [
          {
            q: "Tell me about a time you strongly disagreed with a senior engineer or manager on a technical decision. How did you handle it?",
            a: "This question tests your conflict resolution and communication skills. **How to answer**: Use the STAR method. Focus on objective data over personal opinion. Explain how you brought evidence (benchmarks, documentation, or a small proof of concept) to the discussion. Emphasize that you maintained a professional, collaborative tone. If you ultimately had to 'disagree and commit' to their decision, explain how you fully supported the implementation regardless. Interviewers want to see that you are passionate about engineering quality, but not toxic or dogmatic when you don't get your way."
          },
          {
            q: "Describe a project that failed or a severe bug that you deployed to production. What did you learn?",
            a: "This question tests your humility, accountability, and ability to learn from mistakes. **How to answer**: Never say you haven't made a mistake. Pick a real failure where you were at least partially responsible. Explain the root cause clearly without throwing teammates under the bus. The most critical part of your answer is the 'Learning' phase — what processes, automated tests, or monitoring did you implement afterward to ensure this specific failure could never happen again? Good engineers make mistakes; great engineers build systems to prevent them from repeating."
          }
        ]
      });
    }

    if (!hasSystemDesign) {
      data.categories.push({
        name: 'System Design & Architecture',
        description: 'Advanced questions focusing on scalability, trade-offs, and high-level technical decisions.',
        questions: [
          {
            q: "If our application suddenly receives 10x its normal traffic, what parts of the system would break first and how would you fix them?",
            a: "This tests your understanding of bottlenecks and scalability. **How to answer**: Explain that the database is usually the first bottleneck. You would implement caching (Redis/Memcached) for read-heavy operations to reduce DB load. Next, the application servers might overload — you would ensure they are stateless so you can horizontally scale them behind a load balancer. If the database is still a bottleneck for writes, you would discuss asynchronous processing via message queues (RabbitMQ/Kafka) to decouple the web tier from heavy processing, and finally, database read replicas or sharding as a last resort."
          },
          {
            q: "How do you evaluate and choose a new technology, framework, or database for a greenfield project?",
            a: "This tests your maturity and pragmatism as an engineer. **How to answer**: Emphasize that you choose boring, proven technology over hype. Your evaluation criteria should include: (1) Does it solve the specific business problem? (2) What is the community support and ecosystem like? (3) How steep is the learning curve for the rest of the team? (4) How easy is it to hire developers who know this tech? (5) What are the deployment and maintenance costs? Mention that you usually build a small spike (proof of concept) to validate assumptions before committing the whole team to a new stack."
          }
        ]
      });
    }
    
    // Ensure all existing questions have substantive answers (minimum length check)
    // We append a "Deep Dive Tip" to short answers to increase word count and quality
    data.categories.forEach(cat => {
      cat.questions.forEach(q => {
        if (q.a && q.a.length < 150) {
          q.a += `\n\n**Deep Dive Tip**: Interviewers looking for senior-level depth want to hear about real-world trade-offs. Don't just give the textbook definition; explain *when* you would use this concept and *why* it might be the wrong choice in certain scenarios. Ground your answer in a specific example from a past project to stand out.`;
        }
      });
    });
  }

  // Ensure JSON-LD FAQ Schema capability is robust
  if (!data.faq) {
    data.faq = [
      { q: `What is the best way to prepare for a ${roleName} interview?`, a: `Preparation requires a balanced approach. Spend 40% of your time on core domain knowledge and language fundamentals, 30% on LeetCode-style problem solving (if applicable to the role), 20% on system design or architecture, and 10% on behavioral STAR stories.` },
      { q: `Do I need to know every tool listed in the job description?`, a: `No. Job descriptions are wish lists. If you meet 60-70% of the core requirements and can demonstrate a strong ability to learn quickly, you should apply and interview with confidence.` }
    ];
  } else if (data.faq.length < 2) {
      data.faq.push({ q: `What is the best way to prepare for a ${roleName} interview?`, a: `Preparation requires a balanced approach. Spend 40% of your time on core domain knowledge and language fundamentals, 30% on LeetCode-style problem solving (if applicable to the role), 20% on system design or architecture, and 10% on behavioral STAR stories.` });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log('  EXPANDED:', slug);
  expanded++;
});

console.log('\nDone! Interview Questions Expanded:', expanded);
