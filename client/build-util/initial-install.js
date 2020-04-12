const fs = require('fs');
const execSync = require('child_process').execSync;

let execResult;

// If node_modules dependencies do not exist, then perform a complete install.
if (!fs.existsSync('./node_modules') || !fs.readdirSync('./node_modules').length) {
  execResult = execSync('npm run install:all');
  console.log(execResult.toString());
}
