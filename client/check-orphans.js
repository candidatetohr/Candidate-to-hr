import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const DATA = 'src/data';
const checks = [
  { dir: 'resumeExamples', indexFile: 'src/data/resumeExamples/index.js', route: 'resume-examples' },
  { dir: 'interviewQuestions', indexFile: 'src/data/interviewQuestions/index.js', route: 'interview-questions' },
  { dir: 'careerGuides', indexFile: 'src/data/careerGuides/index.js', route: 'career-guides' },
  { dir: 'salaryGuides', indexFile: 'src/data/salaryGuides/index.js', route: 'salary-guides' },
  { dir: 'roadmaps', indexFile: 'src/data/roadmaps/index.js', route: 'roadmaps' },
];

let orphansFound = false;
console.log('\n========================================');
console.log('     CandidateToHR Orphan Page Check');
console.log('========================================\n');

for (const c of checks) {
  const dir = join(DATA, c.dir);
  const jsonFiles = readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));

  const indexContent = readFileSync(c.indexFile, 'utf8');
  const idMatches = [...indexContent.matchAll(/"id":\s*"([^"]+)"/g)];
  const inIndex = idMatches.map(m => m[1]);

  const notInIndex = jsonFiles.filter(f => !inIndex.includes(f));
  const missingJson = inIndex.filter(id => !jsonFiles.includes(id));

  if (notInIndex.length > 0 || missingJson.length > 0) {
    orphansFound = true;
    console.log(`ISSUES FOUND in [${c.dir}]:`);
    if (notInIndex.length > 0) {
      console.log(`  ❌ JSON files NOT registered in index.js (ORPHAN - not discoverable from hub):`);
      notInIndex.forEach(f => console.log(`       /${c.route}/${f}`));
    }
    if (missingJson.length > 0) {
      console.log(`  ⚠️  Index entries with NO matching JSON file (DEAD LINKS from hub):`);
      missingJson.forEach(id => console.log(`       /${c.route}/${id}`));
    }
    console.log('');
  } else {
    console.log(`✅ ${c.dir}: ${jsonFiles.length} files — all registered, no orphans.`);
  }
}

if (!orphansFound) {
  console.log('\n🎉 All pages are properly registered. No orphans found!');
} else {
  console.log('\n❌ Orphaned or broken pages detected above. Run rebuild-indexes.js to fix.');
}
