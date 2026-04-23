const fs = require('fs');
const files = [
  'src/app/dashboard/page.tsx', 'src/app/comments/page.tsx', 
  'src/app/feeds/page.tsx', 'src/app/settings/page.tsx',
  'src/app/published/page.tsx', 'src/app/pending/page.tsx',
  'src/app/analytics/page.tsx', 'src/app/articles/new/page.tsx'
];
files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/className="flex-1 ml-56 p-6 overflow-y-auto"/g, 'className="flex-1 lg:ml-56 p-3 lg:p-6 w-full max-w-[100vw] lg:max-w-none overflow-y-auto"');
    content = content.replace(/className="flex-1 ml-56 p-6"/g, 'className="flex-1 lg:ml-56 p-3 lg:p-6 w-full max-w-[100vw] lg:max-w-none"');
    fs.writeFileSync(f, content);
  }
});
