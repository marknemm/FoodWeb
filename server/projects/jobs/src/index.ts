import 'reflect-metadata';
import path = require('path');
import { initPaths } from './paths';

// Initialize all global path constants, path mappings, and environment variables for the Express app.
initPaths();

// Must be imported after loading .env into process since requires access to environment variables.
import { initEnvFromSSM } from '~web/helpers/globals/env';
import { initOrm } from '~orm';

// Entry point for AWS Lambda Function.
exports.handler = async () => initJobHarness();

/**
 * Initializes the job harness, which will run a given job.
 * @param jobName The optional name of the job to run. If not given, then the JOB_NAME environment variable is used.
 * @returns A promise that resolves once the job completes.
 */
async function initJobHarness(jobName = ''): Promise<void> {
  try {
    // Initialize app environment variables and TypeORM engine.
    const env = await initEnvFromSSM();
    if (!jobName) {
      jobName = env.JOB_NAME;
    }
    await initOrm();

    // Attempt to load job function from another file based on given jobName (e.g. delete-password-reset).
    let jobFn: () => Promise<any>;
    try {
      jobFn = require(path.join(__dirname, jobName)).default;
    } catch (err) {
      throw new Error(`Job does not exist: '${jobName}'`);
    }

    // Run the loaded job function.
    console.log(`Starting job: '${jobName}'`);
    await jobFn();
    console.log(`Job completed successfully: '${jobName}'`);
  } catch (err) {
    console.error(`Job terminated unsuccessfully: '${jobName}'`, err);
  }
}
