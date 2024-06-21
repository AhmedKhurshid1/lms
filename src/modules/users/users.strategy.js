const QueueFactory = require('../../factories/queue.factory');

const { userProcessor } = require('../../jobs');
const { bullConfig } = require('../../config');

/**
 * User Strategy
 */
class UsersStrategy {

    static saveUsersDataQueue = null;

    static async saveData(data) {
        let { queueOptions, jobOptions, concurrency } = bullConfig;

        if (!UsersStrategy.saveUsersDataQueue) {
            UsersStrategy.saveUsersDataQueue = QueueFactory('saveDataQueue', queueOptions, userProcessor, concurrency);
        }

        UsersStrategy.saveUsersDataQueue.add(data, jobOptions);
        return true;
    }

}

module.exports = UsersStrategy;

