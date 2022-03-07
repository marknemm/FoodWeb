import { initJobHarness, runJob } from './job-harness';

// When running locally outside docker, continuously invoke the job harness handler/initializer in loop.
(async () => {
  await initJobHarness();
  while (true) {
    await runJob();
    process.env.JOB_NAME = ''; // Clear job selection to prompt user for next job to run.
  }
})();
