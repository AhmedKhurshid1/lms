/**
 * REDIS OPTIONS
 * interface RedisOpts {
 * port?: number = 6379;
 * host?: string = localhost;
 * db?: number = 0;
 * password?: string;
 *}
 **/
 const redisOptions = {
    port: 6379,
    host: '127.0.0.1',
}


/**
 * interface QueueOptions {
 * createClient?(type: 'client' | 'subscriber' | 'bclient', config?: Redis.RedisOptions): Redis.Redis | Redis.Cluster;
 * limiter?: RateLimiter;
 * redis?: RedisOpts;
 * prefix?: string = 'bull'; // prefix for all queue keys.
 * defaultJobOptions?: JobOpts;
 * settings?: AdvancedSettings;
} */

const queueOptions = {
    redis : redisOptions
}


/**
 * interface JobOpts {
  priority: number; // Optional priority value. ranges from 1 (highest priority) to MAX_INT  (lowest priority). Note that
  // using priorities has a slight impact on performance, so do not use it if not required.

  delay: number; // An amount of milliseconds to wait until this job can be processed. Note that for accurate delays, both
  // server and clients should have their clocks synchronized. [optional].

  attempts: number; // The total number of attempts to try the job until it completes.

  repeat: RepeatOpts; // Repeat job according to a cron specification.

  backoff: number | BackoffOpts; // Backoff setting for automatic retries if the job fails, default strategy: `fixed`

  lifo: boolean; // if true, adds the job to the right of the queue instead of the left (default false)
  timeout: number; // The number of milliseconds after which the job should be fail with a timeout error [optional]

  jobId: number | string; // Override the job ID - by default, the job ID is a unique
  // integer, but you can use this setting to override it.
  // If you use this option, it is up to you to ensure the
  // jobId is unique. If you attempt to add a job with an id that
  // already exists, it will not be added.

  removeOnComplete: boolean | number; // If true, removes the job when it successfully
  // completes. A number specified the amount of jobs to keep. Default behavior is to keep the job in the completed set.

  removeOnFail: boolean | number; // If true, removes the job when it fails after all attempts. A number specified the amount of jobs to keep
  // Default behavior is to keep the job in the failed set.
  stackTraceLimit: number; // Limits the amount of stack trace lines that will be recorded in the stacktrace.
}
 */

const jobOptions = {
    removeOnComplete: true // If true, removes the job when it successfully
}


module.exports = {
    queueOptions,
    concurrency: 5, /** Note: Concurrency defaults to 1 if not specified. */
    jobOptions
};