const fs = require('fs');
const path = require('path');

// A broad emoji/symbol regex
const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}]/gu;

function walkAndReplace(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.git') && !fullPath.includes('.gemini')) {
        walkAndReplace(fullPath);
      }
    } else {
      const ext = path.extname(fullPath);
      if (['.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.css', '.html'].includes(ext)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (emojiRegex.test(content)) {
            // Strip emojis
            const newContent = content.replace(emojiRegex, '');
            fs.writeFileSync(fullPath, newContent, 'utf8');
            console.log(`Cleaned: ${fullPath}`);
          }
        } catch (e) {
          console.error(`Error processing ${fullPath}:`, e);
        }
      }
    }
  });
}

console.log('--- STARTING CLEANUP ---');
walkAndReplace(path.join(__dirname, 'client'));
walkAndReplace(path.join(__dirname, 'server'));
console.log('--- CLEANUP FINISHED ---');
