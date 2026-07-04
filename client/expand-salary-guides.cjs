/**
 * expand-salary-guides.cjs
 * Bulk-expands all salary guide JSON files with a comprehensive longformAnalysis section.
 * Run: node expand-salary-guides.cjs
 */

const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'src/data/salaryGuides');

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
  
  if (!data.longformAnalysis) {
    data.longformAnalysis = [
      {
        heading: `Understanding the ${roleName} Compensation Landscape in 2026`,
        content: `The compensation structure for a ${roleName} has evolved significantly over the past few years. While base salaries remain strong to combat inflation, the most dramatic shifts are occurring in variable compensation—specifically equity (RSUs) and performance bonuses. At top-tier tech companies (often referred to as FAANG or MAANG), a senior ${roleName} can expect equity to make up 40% to 60% of their Total Target Compensation (TTC). \n\nHowever, it's crucial to understand the difference between public company RSUs (which are as good as cash once they vest) and startup options (which carry significant liquidity risk). When evaluating an offer, always calculate the 4-year guaranteed cash value versus the "optimistic" equity value. Geography also plays a shrinking, but still relevant, role. With the normalization of remote work, we are seeing a convergence of salaries across North America, though Tier 1 hubs like San Francisco and New York still command a 15-20% premium over Tier 2 cities.`
      },
      {
        heading: `How to Maximize Your Salary as a ${roleName}`,
        content: `Maximizing your earning potential as a ${roleName} requires a strategic approach beyond simply "writing good code" or "working hard." Here are the three most effective levers you can pull to increase your compensation:\n\n**1. Specialization and Niche Expertise**\nGeneralists are valuable, but specialists command a premium. If you can position yourself at the intersection of two critical domains—for example, a ${roleName} who deeply understands security compliance (SOC2/HIPAA) or distributed systems performance optimization—you immediately transition from a commodity to a scarce resource.\n\n**2. Master the Art of Negotiation**\nMost professionals leave 10% to 20% on the table simply because they don't negotiate effectively. The golden rule is: never give the first number. Always anchor your expectations to current market data (using guides like this one), and remember that you can negotiate more than just base salary. Signing bonuses, extra PTO, accelerated equity vesting, and remote work stipends are highly negotiable.\n\n**3. Job Hopping vs. Internal Promotion**\nStatistically, the fastest way to increase your salary is by changing companies every 2 to 3 years. Internal promotion budgets are typically capped at 4% to 8% increases, whereas external offers routinely offer 15% to 30% bumps. However, staying at a company for 4+ years allows you to build the deep institutional knowledge required to reach Staff or Principal levels, which unlock entirely new compensation bands.`
      },
      {
        heading: `Future Outlook and Automation Risks`,
        content: `With the rapid advancement of AI coding assistants (like GitHub Copilot and Claude) and automated deployment pipelines, many wonder if the ${roleName} role will face downward wage pressure. The current data suggests the opposite. AI tools are acting as multipliers, making a skilled ${roleName} significantly more productive. Because they can ship features faster and manage larger systems, their economic value to the company actually *increases*.\n\nThe professionals who face wage stagnation are those who refuse to adopt these AI tools and remain stuck in manual, repetitive workflows. To future-proof your compensation, you must move up the stack: spend less time on boilerplate implementation and more time on system architecture, cross-team communication, and aligning technical decisions with business revenue goals.`
      }
    ];
  }

  // Ensure JSON-LD FAQ Schema capability is robust
  if (!data.faq) {
    data.faq = [
      { q: `What is a good starting salary for a junior ${roleName}?`, a: `In the US, a competitive starting salary for a junior ${roleName} ranges from $75,000 to $110,000 depending on the cost of living in your city and whether the company is venture-backed.` },
      { q: `Do ${roleName}s get bonuses?`, a: `Yes. Mid-level and senior roles typically include an annual performance bonus ranging from 10% to 20% of your base salary, plus an equity grant.` }
    ];
  } else if (data.faq.length < 2) {
      data.faq.push({ q: `What is a good starting salary for a junior ${roleName}?`, a: `In the US, a competitive starting salary for a junior ${roleName} ranges from $75,000 to $110,000 depending on the cost of living in your city and whether the company is venture-backed.` });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log('  EXPANDED:', slug);
  expanded++;
});

console.log('\nDone! Salary Guides Expanded:', expanded);
