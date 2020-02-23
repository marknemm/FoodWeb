import { CronCommand, CronJob } from 'cron';

const _cronJobs = new Map<string, CronJob>();

export function runJobEveryXMins(jobName: string, job: () => void, minInterval: number): void {
  runCronJob(jobName, job, `0 */${minInterval} * * * *`);
}

export function runJobEveryXHours(jobName: string, job: () => void, hourInterval: number): void {
  runCronJob(jobName, job, `0 0 */${hourInterval} * * *`);
}

export function runJobAtDate(jobName: string, job: () => void, timestamp: Date): void {
  runCronJob(jobName, job, timestamp);
}

export function runCronJob(jobName: string, job: () => void, cronTime: string | Date): void {
  const cronJob = new CronJob(cronTime, _cronExec.bind(this, jobName, job), undefined, true);
  console.log(`Started cron job '${jobName}'`);
  _cronJobs.set(jobName, cronJob);
}

function _cronExec(jobName: string, cronCommand: CronCommand): void {
  (<(() => void)>cronCommand)();
  console.log(`Ran Cron Job '${jobName}' at ${new Date()}`);
}

export function stopJob(jobName: string): void {
  _getCronJob(jobName).stop();
  console.log(`Stopped cron job '${jobName}'`);
  _cronJobs.delete(jobName);
}

function _getCronJob(jobName: string): CronJob {
  const cronJob: CronJob = _cronJobs.get(jobName);
  if (!cronJob) {
    throw new Error(`Cron Job does not exist with name: ${jobName}`);
  }
  return cronJob;
}
