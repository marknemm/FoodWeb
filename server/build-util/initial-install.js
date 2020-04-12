const fs = require('fs');
const execSync = require('child_process').execSync;
const path = require('path');

const serverRootDir = path.join(__dirname, '..');
let execResult;

// If node_modules dependencies do not exist, then perform a complete install.
const nodeModulesDir = path.join(serverRootDir, 'node_modules');
if (!fs.existsSync(nodeModulesDir) || !fs.readdirSync(nodeModulesDir).length) {
  execResult = execSync('npm run install:all');
  console.log(execResult.toString());
}

// Run the 'pg-initialize.js' database util script, which will initialize the database if not already done.
const initDBPathname = path.join(serverRootDir, 'database', 'util', 'js', 'pg-initialize.js');
execResult = execSync(`node ${initDBPathname}`);
console.log(execResult.toString());
