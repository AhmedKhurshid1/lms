const Queue = require('bull');

/**
 * Factory for queue 
 * @param {string} queueName 
 * @param {*} queueOptions 
 * @param {Function} processor 
 * @param {number} concurrency 
 * @returns {Queue} newQueue 
 */
const QueueFactory = (queueName, queueOptions, processor, concurrency) => {
    // Create queue
    const newQueue = new Queue(queueName, queueOptions);

    // Add function to process save saveExams job queue
    newQueue.process(concurrency, processor);

    return newQueue;
}

module.exports = QueueFactory;