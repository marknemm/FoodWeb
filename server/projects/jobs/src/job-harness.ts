import 'reflect-metadata';
import path = require('path');
import { initPaths } from '../../../projects/web/src/helpers/globals/paths';

// Initialize all global path constants, path mappings, and environment variables for the Express app.
initPaths('jobs', __dirname);

// Must be imported after loading .env into process since requires access to environment variables.
import { env } from '~web/helpers/globals/env';
import { initOrm } from '~orm';

/**
 * Initializes the job harness, which will run a given job.
 * @param jobName The optional name of the job to run. If not given, then the JOB_NAME environment variable is used.
 * @returns A promise that resolves once the job completes.
 */
export function initJobHarness(jobName: string = env.JOB_NAME): Promise<void> {
  return initOrm()
    .then(() => {
      console.log(`Starting job: '${jobName}'`);
      let jobFn: Function; // Will be dynamically required via given jobName (e.g. delete-password-reset).
      try         { jobFn = require(path.join(__dirname, jobName)).default; }
      catch (err) { throw new Error(`Job does not exist: '${jobName}'`); }
      jobFn();
    })
    .then(() => console.log(`Job completed successfully: '${jobName}'`))
    .catch((err: Error) => {
      console.error(`Job terminated unsuccessfully: '${jobName}'`);
      console.error(err);
    });
}
