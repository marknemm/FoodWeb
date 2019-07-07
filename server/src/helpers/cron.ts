import { CronJob, CronCommand } from 'cron';

const _cronJobs = new Map<string, CronJob>();

export function runJobEveryXMins(jobName: string, cronCommand: CronCommand, minInterval: number): void {
  const cronJob = new CronJob(`*/${minInterval} * * * * *`, cronCommand, _logCronJobExec.bind(jobName), true);
  _cronJobs.set(jobName, cronJob);
}

export function runJobAtTime(jobName: string, cronCommand: CronCommand, timestamp: Date): void {
  const cronJob = new CronJob(timestamp, cronCommand, _logCronJobExec.bind(jobName), true);
  _cronJobs.set(jobName, cronJob);
}

export function stopJob(jobName: string): void {
  _getCronJob(jobName).stop();
  _cronJobs.delete(jobName);
}

function _getCronJob(jobName: string): CronJob {
  const cronJob: CronJob = _cronJobs.get(jobName);
  if (!cronJob) {
    throw new Error(`Cron Job does not exist with name: ${jobName}`);
  }
  return cronJob;
}

function _logCronJobExec(jobName: string): void {
  console.log(`Ran Cron Job '${jobName}' at ${new Date()}`);
}
