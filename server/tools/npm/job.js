require('../util/env')();
const path = require('path');
const spawn = require('../util/spawn');
const { getOptionalArg } = require('../util/args');
const { getFileChoices, selectPrompt } = require('../util/prompt');

// The directory that contains the available jobs that may be run.
const jobsDir = path.join(global['serverWebDistDir'], 'server', 'projects', 'web', 'src', 'jobs');

// Get the optional script `jobName` argument, and run the job.
getOptionalArg('jobName')
  .then(runJob)
  .catch(console.error)
  .finally(process.exit);

/**
 * Runs a given job. If the provided `jobName` is falsey, then prompts the user for the job to run.
 * @param {string} command The name of the job that shall be run.
 * @return {Promise<void>} A promise that resolves once the job completes.
 */
async function runJob(jobName) {
  if (!jobName) {
    const availableJobs = await getFileChoices(jobsDir, ['jobs-config']);
    jobName = await selectPrompt('Select a job', availableJobs);
  }
  jobName = jobName.replace(/\.[jt]s$/, '');
  const jobPathName = path.join(jobsDir, `${jobName}.js`);
  await spawn('npm', ['run', 'build']);
  await spawn('node', [jobPathName], `job: ${jobName}`);
}
