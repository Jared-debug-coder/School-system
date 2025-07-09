const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Build the project
console.log('Building project...');
execSync('npm run build', { stdio: 'inherit' });

// Check if dist folder exists
if (!fs.existsSync('dist')) {
  console.error('Build failed: dist folder not found');
  process.exit(1);
}

// Add CNAME file if needed (for custom domain)
// fs.writeFileSync(path.join('dist', 'CNAME'), 'your-domain.com');

// Deploy to gh-pages branch
console.log('Deploying to GitHub Pages...');
try {
  execSync('npx gh-pages -d dist', { stdio: 'inherit' });
  console.log('✅ Successfully deployed to GitHub Pages!');
  console.log('🌐 Your site will be available at: https://jared-debug-coder.github.io/School-System/');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
