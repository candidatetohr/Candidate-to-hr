const fs = require('fs');
const path = require('path');

// A broad emoji/symbol regex
const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}]/gu;

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.git') && !fullPath.includes('.gemini')) {
        results = results.concat(walk(fullPath));
      }
    } else {
      const ext = path.extname(fullPath);
      if (['.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.css', '.html'].includes(ext)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (emojiRegex.test(content)) {
            // Check specifically which lines
            const lines = content.split('\n');
            lines.forEach((line, i) => {
              const matches = line.match(emojiRegex);
              if (matches) {
                results.push(`${fullPath}:${i + 1} -> ${matches.join(', ')}`);
              }
            });
          }
        } catch (e) {}
      }
    }
  });
  return results;
}

const res = walk(path.join(__dirname, 'client'));
const resServer = walk(path.join(__dirname, 'server'));

console.log('--- EMOJIS FOUND ---');
[...res, ...resServer].forEach(r => console.log(r));
