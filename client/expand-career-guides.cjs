/**
 * expand-career-guides.js
 * Bulk-expands all career guide JSON files to ensure they have thick E-E-A-T content.
 * Fixes template errors and adds new comprehensive sections.
 * Run: node expand-career-guides.cjs
 */

const fs = require('fs');
const path = require('path');

const GUIDES_DIR = path.join(__dirname, 'src/data/careerGuides');

// Helper to extract clean role name from slug
function getRoleName(slug) {
  // e.g., how-to-become-software-engineer -> Software Engineer
  // e.g., ats-resume-tips -> ATS Resume Tips
  let name = slug.replace('how-to-become-', '').replace('-roadmap-2026', '');
  return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const files = fs.readdirSync(GUIDES_DIR).filter(f => f.endsWith('.json'));
let expanded = 0;

files.forEach(filename => {
  const filePath = path.join(GUIDES_DIR, filename);
  const slug = filename.replace('.json', '');
  const roleName = getRoleName(slug);
  
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.log('  ERROR parsing:', slug, e.message);
    return;
  }
  
  // Fix template issues in existing sections
  if (data.sections && Array.isArray(data.sections)) {
    data.sections.forEach(sec => {
      // Replace awkward title injections with actual role name
      sec.content = sec.content.replace(new RegExp(data.hero.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), roleName);
      sec.heading = sec.heading.replace(new RegExp(data.hero.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), roleName);
    });
  }

  // Add new deep-dive sections if they don't exist
  const hasDayInLife = data.sections.some(s => s.heading.includes('Day in the Life'));
  
  if (!hasDayInLife && !slug.includes('ats-resume') && !slug.includes('negotiate-salary') && !slug.includes('skills-to-learn')) {
    data.sections.push({
      heading: `A Day in the Life of a ${roleName}`,
      content: `What does a ${roleName} actually do on a daily basis? While the exact routine varies by company size and culture, here is a realistic breakdown of a typical day in a modern tech company:\n\n**Morning: Standups and Deep Work**\nThe day usually begins with a 15-minute daily standup meeting (often agile/scrum). You will report on what you did yesterday, what you plan to do today, and if you have any "blockers" preventing you from making progress. Following this, the morning is typically reserved for deep work — heads-down time focused on your primary tasks, whether that's writing code, analyzing data, or designing architecture. This is when your brain is freshest, making it ideal for tackling complex technical challenges.\n\n**Mid-Day: Code Reviews and Collaboration**\nAfter lunch, the focus often shifts to collaboration. You will likely spend 1-2 hours reviewing pull requests (PRs) from your teammates. Code review is a critical part of the job; it ensures code quality, spreads knowledge across the team, and helps catch bugs before they reach production. You might also participate in pair programming sessions to unblock a colleague or brainstorm solutions to an architectural problem.\n\n**Afternoon: Meetings and Planning**\nThe latter half of the day often involves meetings. These could be sprint planning sessions, architecture reviews, cross-functional syncs with product managers and designers, or 1-on-1s with your engineering manager. Between meetings, you'll continue coding, writing unit tests for your features, and updating documentation. A great ${roleName} knows that writing clear documentation is just as important as writing clean code.`
    });

    data.sections.push({
      heading: `The Reality of the Job: What They Don't Tell You`,
      content: `Tutorials and bootcamps paint a rosy picture of tech, but the reality of working as a ${roleName} involves challenges that you must be prepared for:\n\n**Reading Code is Harder Than Writing It**\nYou will spend significantly more time reading and deciphering existing, often undocumented legacy code than you will writing brand new "greenfield" code from scratch. Learning to navigate massive codebases, use global search effectively, and trace execution flows is a survival skill.\n\n**Imposter Syndrome is Universal**\nBecause the technology landscape evolves so rapidly, you will constantly encounter tools, frameworks, and concepts you don't understand. Even senior engineers Google basic syntax daily. The goal isn't to know everything; the goal is to become incredibly efficient at finding answers and learning just-in-time.\n\n**Communication Outweighs Coding**\nAs you progress from a junior to a mid-level and senior ${roleName}, your technical skills become table stakes. Your career trajectory will be defined by your "soft skills" — your ability to clearly explain technical trade-offs to non-technical stakeholders, write persuasive technical design documents, and mentor junior team members. Building the right thing is often harder than building the thing right.`
    });

    data.sections.push({
      heading: `Top Mistakes to Avoid as a Junior ${roleName}`,
      content: `When breaking into this field, avoid these common pitfalls that can stall your career growth:\n\n1. **Getting Stuck in "Tutorial Hell"**: Watching videos without building anything yourself creates a false sense of competence. The moment you start a blank project, you'll realize you don't know where to begin. Break this cycle by building projects without step-by-step guides.\n2. **Ignoring the Fundamentals**: Frameworks come and go. React, Vue, and Angular will eventually be replaced. But HTTP, DNS, SQL, Git, and underlying computer science principles will outlast them all. Invest heavily in the fundamentals.\n3. **Failing to Ask for Help (or Asking Too Soon)**: Junior engineers often struggle with balancing independence and collaboration. The 15-minute rule is a great heuristic: if you are stuck on a problem, you must try to solve it yourself for 15 minutes. If you are still stuck after 15 minutes, you *must* ask for help to avoid wasting hours of company time.\n4. **Neglecting Edge Cases and Error Handling**: The "happy path" (when the user does everything perfectly) is easy to code. Production engineering is about handling the unhappy paths — what happens when the network fails? When the database times out? When the user inputs invalid data? Think defensively.`
    });
  }

  // Ensure JSON-LD FAQ Schema capability
  if (!data.faq) {
    data.faq = [
      { q: `Is a degree required to become a ${roleName}?`, a: `No. While a Computer Science degree helps bypass automated HR filters, a strong portfolio, open-source contributions, and a proven ability to pass technical interviews can get you hired.` },
      { q: `How long does it take to become a ${roleName}?`, a: `If you study intensely (20-40 hours/week), you can reach an employable level in 6-9 months. Part-time studying typically takes 12-18 months.` },
      { q: `What is the most important skill for a ${roleName}?`, a: `Problem-solving and the ability to learn continuously. Technologies change constantly, so being adaptable is far more valuable than memorizing specific syntax.` }
    ];
  } else if (data.faq.length < 3) {
      data.faq.push({ q: `Is a degree required to become a ${roleName}?`, a: `No. While a Computer Science degree helps bypass automated HR filters, a strong portfolio, open-source contributions, and a proven ability to pass technical interviews can get you hired.` });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log('  EXPANDED:', slug);
  expanded++;
});

console.log('\nDone! Career Guides Expanded:', expanded);
