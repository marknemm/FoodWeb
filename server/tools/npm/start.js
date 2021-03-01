const env = require('../util/env');
const commandExists = require('command-exists');
const path = require('path');
const sleep = require('../util/sleep');
const spawn = require('../util/spawn');
const { getHost } = require('../util/host');
const { getOptionalArg } = require('../util/args');
const { selectProjectPrompt } = require('../util/prompt');

// Get the optional script `project` argument, and start the node server.
getOptionalArg('project')
  .then(startServer)
  .catch(console.error)
  .finally(process.exit);

/**
 * Runs a given server project on a nodemon server. If the provided `project` is falsey, then prompts the user for the project.
 * @param {string} project The name of the project that shall be run.
 * @return {Promise<void>} A promise that resolves once the server terminates.
 */
async function startServer(project) {
  if (!project) {
    project = await selectProjectPrompt();
  }
  env(project); // Be sure to init utilized .env based on selected project.

  const isWeb = (project === 'web');
  const distDir = (isWeb ? global['serverWebDistDir'] : global['serverAdminDistDir']);
  const inspectPort = (isWeb ? '9229' : '9230');
  const projectDir = (isWeb ? global['serverWebDir'] : global['serverAdminDir']);
  const tsconfigPathname = path.join(projectDir, 'tsconfig.json');
  const dotEnvPathname = path.join(projectDir, '.env');
  const distProjectsDir = path.join(distDir, 'server', 'projects');
  const indexJsPathname = path.join(distProjectsDir, project, 'src', 'index.js');

  await initDockerServices();
  await spawn('node', ['./tools/npm/init-project.js', project]);
  await spawn('rimraf', [path.join(distDir, '*')]);
  await spawn('tsc-watch', ['-p', tsconfigPathname, '--noClear', '--onFirstSuccess', `nodemon -e .js,.hbs,.css --watch ${distProjectsDir} --watch ${global['serverTemplatesDir']} --watch ${dotEnvPathname} --inspect=0.0.0.0:${inspectPort} ${indexJsPathname}`]);
}

/**
 * Initialize the docker services containers (e.g. postgres, redis, fake-smtp-server) if they have not already been intiialized.
 * @return {Promise<void>} A promise that resolves once the docker service containers have been initialized.
 */
async function initDockerServices() {
  // Only docker-compose up foodweb-services if the docker-compose command exists (will not exist inside docker container).
  // If in foodweb-server docker container, then the services should have already been initialized as dependencies.
  if (await commandExists('docker-compose').catch(() => false)) {
    const postgresIsUp = await getHost(process.env.DATABASE_PORT || 5432, 'postgres')
    await spawn('docker-compose', ['up', '-d', 'foodweb-services']);
    if (!postgresIsUp) {
      console.log('Waiting for postgres container to initialize...');
      await sleep(5000); // Sleep between each ping of the postgres container port.
    }
  }
}
