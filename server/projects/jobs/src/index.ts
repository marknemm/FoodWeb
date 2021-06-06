import { initJobHarness } from './job-harness';

// Entry point for AWS Lambda Function.
exports.handler = async () => initJobHarness();
