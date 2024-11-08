const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure the data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Compile TypeScript
console.log('Compiling TypeScript...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('Compilation failed:', error.message);
  process.exit(1);
}

// Run the compiled JavaScript
console.log('Running the server...');
try {
  execSync('npm start', { stdio: 'inherit' });
} catch (error) {
  console.error('Server execution failed:', error.message);
  process.exit(1);
}
