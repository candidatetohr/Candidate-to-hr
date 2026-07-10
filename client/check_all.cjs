const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const errors = [];
  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });

  const urls = [
    'http://localhost:5173/',
    'http://localhost:5173/live-editor',
    'http://localhost:5173/learning-path',
    'http://localhost:5173/interview-sim',
    'http://localhost:5173/analyze',
    'http://localhost:5173/roadmaps',
    'http://localhost:5173/salary-guides',
    'http://localhost:5173/career-guides'
  ];

  for (const url of urls) {
    errors.length = 0;
    console.log(`\nNavigating to ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });
    if (errors.length > 0) {
      console.log(`--- Errors on ${url} ---`);
      console.log(errors.join('\n'));
    } else {
      console.log(`No errors on ${url}`);
    }
  }

  await browser.close();
})();
