require('../util/env')();
const isPortReachable = require('is-port-reachable');
const path = require('path');
const spawn = require('../../../shared/tools/util/spawn');
const { promises: fs } = require('fs');
const { getOptionalArg } = require('../../../shared/tools/util/args');
const { selectPrompt, inputPrompt } = require('../util/prompt');

const tsconfigPathname = path.join(global['serverWebDir'], 'tsconfig.json');
const typeOrmCliPath = path.join(global['serverDir'], 'node_modules', 'typeorm', 'cli');

/**
 * A registry of possible TypeORM commands.
 */
const commandRegistry = {
  create: ['migration:create', '-n'],
  generate: ['migration:generate', '-n'],
  revert: ['migration:revert'],
  run: ['migration:run'],
};

// Get the optional script `command` argument, and run the TypeORM command.
getOptionalArg('command')
  .then(runTypeorm)
  .then(process.exit)
  .catch((err) => { console.error(err); process.exit(1); });

/**
 * Runs a given TypeORM command. If the command is falsy, then prompts the user for the command first.
 * @param {string} command The TypeORM command that shall be run.
 * @return {Promise<void>} A promise that resolves once the command completes.
 */
async function runTypeorm(command) {
  // If command not specified as script arg, then prompt user to select from command registry.
  if (!command) {
    const commandChoices = Object.keys(commandRegistry);
    command = await selectPrompt('Select a command', commandChoices);
  }

  // If the command requires a migration name argument, then ask the user for a name.
  const migrationName = (['create', 'generate'].indexOf(command) >= 0)
    ? await inputPrompt('TypeORM migration name')
    : '';

  // Execute the command.
  return execOrmCli(command, migrationName)
}

/**
 * Executes the TypeORM CLI with the correct configuration (either local or docker).
 * @param {string} command The ORM CLI command to execute.
 * @param {string} migrationName The optional name of the migration that will be given as an argument to the CLI command.
 * @return {Promise<void>} A promise that resolves once this operation completes.
 */
async function execOrmCli(command, migrationName) {
  // Before running TypeORM CLI, dump the database in-case something goes wrong, and perform a build to ensure we have most recent compiled entities.
  await spawn('npm', ['run', 'pg', 'dump'].concat(migrationName ? [migrationName] : []));
  if (command === 'generate') {
    await spawn('npm', ['run', 'build', 'web']);
  }

  // Run the TypeORM CLI. Check if the PostgreSQL instance is accessible on localhost or docker network (postgres).
  const commandArgs = commandRegistry[command].concat(migrationName ? [migrationName] : []);
  if (await isPortReachable(5432)) { // Try local.
    const typeOrmCliArgs = ['--project', tsconfigPathname, '-r', 'tsconfig-paths/register', typeOrmCliPath, '-f', 'ormconfig.json'];
    await spawn('ts-node', typeOrmCliArgs.concat(commandArgs), `command: ${command}`);
  } else if (await isPortReachable(5432, { host: 'postgres' })) { // Try docker.
    const typeOrmCliArgs = ['--project', tsconfigPathname, '-r', 'tsconfig-paths/register', typeOrmCliPath, '-f', 'docker-ormconfig.json'];
    await createDockerOrmConfig(); // Create temp docker-ormconfig.json to replace localhost with docker network's postgres.
    await spawn('ts-node', typeOrmCliArgs.concat(commandArgs), `command: ${command}`);
    await spawn(commandScript, `command: ${command}`);
    await fs.unlink(dockerOrmConfigPathname); // Delete docker config when done to enforce single source of truth in original ormconfig.json!
  } else { // Give up.
    console.error('Could not connect to a development PostgreSQL instance.');
    process.exit(1);
  }
}

/**
 * Creates a docker-ormconfig.json file by copying the contents of the original local ormconfig.json file.
 * NOTE: This file is only temporary, and is produced dynamically during every docker execution of this script.
 * @return {Promise<void>} A promise that resolves once the docker-ormconfig.json file is created.
 */
async function createDockerOrmConfig() {
  // Create the docker-ormconfig.json file.
  const ormConfigPath = path.join(__dirname, '..', '..');
  const ormConfigPathname = path.join(ormConfigPath, 'ormconfig.json');
  const dockerOrmConfigPathname = path.join(ormConfigPath, 'docker-ormconfig.json');
  await fs.copyFile(ormConfigPathname, dockerOrmConfigPathname);

  // Replace the ORM host to use the internal docker network host 'postgres'.
  const dockerOrmConfigJSON = JSON.parse(fs.readFileSync(dockerOrmConfigPathname));
  dockerOrmConfigJSON.host = 'postgres';
  await fs.writeFile(dockerOrmConfigPathname, JSON.stringify(dockerOrmConfigJSON, undefined, 2), { encoding: 'utf8', flag: 'w' });
}
