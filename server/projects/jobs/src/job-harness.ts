import { promises as fs } from 'fs';
import path = require('path');
import 'reflect-metadata';
import { initPaths } from '../../web/src/helpers/globals/paths'; // Cannot use ~web/ path map until initPaths is called.

initPaths('jobs', __dirname); // Init all global path variables and tsconfig path mappings for imports (e.g. ~web, ~shared).

// Lambda Function handler invoked by AWS Lambda when deployed to production.
exports.handler = async () => {
  await initJobHarness();
  await runJob();
};

/**
 * Initializes the job harness, which will run a given job.
 * @returns A promise that resolves once the harness is initialized.
 */
export async function initJobHarness(): Promise<void> {
  await require('~web/helpers/globals/env').initEnv();
  await require('~orm').initOrm();
}

export async function runJob(): Promise<void> {
  const jobFn: () => Promise<any> = await getJobFn();

  try {
    console.log(`Starting job: '${process.env.JOB_NAME}'`);
    await jobFn();
    console.log(`Job completed successfully: '${process.env.JOB_NAME}'`);
  } catch (err) {
    console.error(`Job terminated unsuccessfully: '${process.env.JOB_NAME}'`, err);
    process.exit(1);
  }
}

/**
 * Attempt to load job function from another file based on 'JOB_NAME' env variable (e.g. delete-password-reset).
 * @returns A promise that resolves to the loaded job function.
 */
async function getJobFn(): Promise<() => Promise<any>> {
  if (!process.env.JOB_NAME) {
    process.env.JOB_NAME = await showJobSelectPrompt();
  }

  try {
    return require(path.join(__dirname, process.env.JOB_NAME)).handler;
  } catch (err) {
    console.error(`Job does not exist or could not be loaded: '${process.env.JOB_NAME}'`, err);
    process.exit(1);
  }
}

/**
 * Generates a job selection prompt in stdin.
 * @return A promise that resolves to the user selected job name.
 */
async function showJobSelectPrompt(): Promise<string> {
  const jobChoices: string[] = (await fs.readdir(__dirname))
    .map((file: string) => file.replace(/\..*$/, ''))
    .filter((file: string) => ['index', 'job-harness'].indexOf(file) < 0);

  return (await require('prompts')({
    type: 'select',
    name: 'choice',
    message: 'Select a job to run: ',
    choices: jobChoices.map(
      (jobChoice: string) => ({ title: jobChoice, value: jobChoice })
    )
  })).choice;
}
