// Executes TypeORM CLI commands with a base configuration.

const { execSync } = require('child_process');
const fs = require('fs');
const isPortReachable = require('is-port-reachable');
const path = require('path');

execOrmCli();

/**
 * Executes the TypeORM CLI with the correct configuration (either local or docker).
 * @return {Promise<void>} A promsie that resolves once this operation completes.
 */
async function execOrmCli() {
  const tsconfigPathname = path.join(__dirname, '..', '..', 'projects', 'web', 'tsconfig.json');
  const typeOrmCliPath = path.join(__dirname, '..', '..', 'node_modules', 'typeorm', 'cli');
  const typeOrmArgs = process.argv.slice(2).join(' ');

  if (await isPortReachable(5432)) { // Try local.
    execSync(`ts-node --project ${tsconfigPathname} -r tsconfig-paths/register ${typeOrmCliPath} -f ormconfig.json ${typeOrmArgs}`);
  } else if(await isPortReachable(5432, { host: 'postgres' })) { // Try docker.
    execDockerOrmCli(tsconfigPathname, typeOrmCliPath, typeOrmArgs);
  } else { // Give up.
    console.error('Could not connect to a development PostgreSQL instance.');
    process.exit(1);
  }
}

/**
 * Executes the TypeORM CLI with a configuration for docker.
 * @param {string} tsconfigPathname The pathname for the tsconfig.json file that shall be configured for ts-node exec.
 * @param {string} typeOrmCliPath The TypeORM CLI node_modules path.
 * @param {string} typeOrmArgs The TypeORM CLI execution arguments.
 */
function execDockerOrmCli(tsconfigPathname, typeOrmCliPath, typeOrmArgs) {
  const dockerOrmConfigPathname = createDockerOrmConfig();
  updateDockerOrmConfigHost(dockerOrmConfigPathname);
  execSync(`ts-node --project ${tsconfigPathname} -r tsconfig-paths/register ${typeOrmCliPath} -f docker-ormconfig.json ${typeOrmArgs}`);
  fs.unlinkSync(dockerOrmConfigPathname); // Delete docker config when done to enforce single source of truth in original ormconfig.json!
}

/**
 * Creates a docker-ormconfig.json file by copying the contents of the original local ormconfig.json file.
 * NOTE: This file is only temporary, and is produced dynamically during every docker execution of this script.
 * @return {string} The pathname of the created docker-ormconfig.json file.
 */
function createDockerOrmConfig() {
  const ormConfigPath = path.join(__dirname, '..', '..');
  const ormConfigPathname = path.join(ormConfigPath, 'ormconfig.json');
  const dockerOrmConfigPathname = path.join(ormConfigPath, 'docker-ormconfig.json');
  fs.copyFileSync(ormConfigPathname, dockerOrmConfigPathname);
  return dockerOrmConfigPathname;
}

/**
 * Updates the host property within the docker-ormconfig.json file so that the docker network is accessed instead of localhost.
 * @param {string} dockerOrmConfigPathname The pathname of the docker-ormconfig.json file.
 */
function updateDockerOrmConfigHost(dockerOrmConfigPathname) {
  const dockerOrmConfigJSON = JSON.parse(fs.readFileSync(dockerOrmConfigPathname));
  dockerOrmConfigJSON.host = 'postgres';
  fs.writeFileSync(dockerOrmConfigPathname, JSON.stringify(dockerOrmConfigJSON, undefined, 2), { encoding: 'utf8', flag: 'w' });
}
