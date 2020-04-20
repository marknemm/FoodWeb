const fs = require('fs');
const execSync = require('child_process').execSync;
const path = require('path');

const project = process.argv[2];
if (['web', 'admin'].indexOf(project) < 0) {
  throw new Error(`Must specify which project you are initializing via 'web' or 'admin' argument.`);
}

const serverRootDir = path.join(__dirname, '..');
const projectRootDir = path.join(serverRootDir, 'projects', project);
let execResult;

// If node_modules dependencies do not exist, then perform a complete install.
const nodeModulesDir = path.join(serverRootDir, 'node_modules');
if (!fs.existsSync(nodeModulesDir) || !fs.readdirSync(nodeModulesDir).length) {
  execResult = execSync('npm run install:all');
  console.log(execResult.toString());
}

// If '.env' file does not exist for the project that we are performing an initial install on, then generate it from '.env.example'.
const dotEnvPathname = path.join(projectRootDir, '.env');
const dotEnvExamplePathname = path.join(projectRootDir, '.env.example');
if (!fs.existsSync(dotEnvPathname)) {
  fs.copyFileSync(dotEnvExamplePathname, dotEnvPathname);
}

// Run the 'pg-initialize.js' database util script, which will initialize the database if not already done.
const initDBPathname = path.join(serverRootDir, 'database', 'util', 'js', 'pg-initialize.js');
execResult = execSync(`node ${initDBPathname}`);
console.log(execResult.toString());
