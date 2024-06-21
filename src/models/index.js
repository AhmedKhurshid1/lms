// const { Sequelize } = require("sequelize");
// /** Third party dependencies */

// const fs = require("fs");

// const util = require("util");

// const path = require("path");

// const applyRelationships = require("./relationships");

// /** Local dependencies & Functions */
// const {
//   setupSequelize,
//   setupSequelizeTesting,
// } = require("../config/dbClientInit");

// const { SEED } = require("../config");

// const { getGen } = require("../libraries/common");

// /** Local imports & constants */
// const config = require("../config");

// const readDir = util.promisify(fs.readdir);

// module.exports = async () => {
//   const { MSSQL_DB_HOST, TEST_DB_HOST } = config;

//   var sequelizeInstance = null;
//   if (MSSQL_DB_HOST && process.env.NODE_ENV != "test") {
//     sequelizeInstance = await setupSequelize(Sequelize, {
//       ...config,
//     });
//   } else if (TEST_DB_HOST && process.env.NODE_ENV == "test") {
//     sequelizeInstance = await setupSequelizeTesting(Sequelize, {
//       ...config,
//     });
//   }

//   // global.db = { models: {} };

//   // if (sequelizeInstance)
//   global.db = sequelizeInstance;

//   const files = await readDir(path.join(__dirname, "./imports"));

//   for await (let iterator of getGen(files.length)) {
//     const file = files[iterator];
//     const moduleName = file.split(".").shift();

//     const modelFilePath = path.join(__dirname, `./imports/${file}`);
//     await require(modelFilePath)(sequelizeInstance);
//   }

//   // applyRelationships(sequelizeInstance);

//   const isSeedMode = JSON.parse(SEED || false);

//   sequelizeInstance.models.role.sync({ alter: true });
//   sequelizeInstance.models.users.sync({ alter: true });
//   sequelizeInstance.models.questionType.sync({ alter: true });
//   sequelizeInstance.models.question.sync({ alter: true });
//   sequelizeInstance.models.answer.sync({ alter: true });
//   sequelizeInstance.models.report.sync({ alter: true });

//   if (isSeedMode) {
//     console.log("Seeding ...");
//     await db.sync({
//       force: true,
//     });
//   }

//   return sequelizeInstance || null;
// };




const fs = require('fs');
const util = require('util');
const path = require('path');
const { Sequelize } = require('sequelize');
const config = require('../config');
const { setupSequelize, setupSequelizeTesting } = require('../config/dbClientInit');
const { SEED } = require('../config');
const { getGen } = require('../libraries/common');

const readDir = util.promisify(fs.readdir);

module.exports = async () => {
  const { MSSQL_DB_HOST, TEST_DB_HOST } = config;
  let sequelizeInstance = null;

  if (MSSQL_DB_HOST && process.env.NODE_ENV !== 'test') {
    sequelizeInstance = await setupSequelize(Sequelize, { ...config });
  } else if (TEST_DB_HOST && process.env.NODE_ENV === 'test') {
    sequelizeInstance = await setupSequelizeTesting(Sequelize, { ...config });
  }

  global.db = sequelizeInstance;

  const files = await readDir(path.join(__dirname, './imports'));

  for (const file of files) {
    if (file.endsWith('.js')) {
      const modelFilePath = path.join(__dirname, `./imports/${file}`);
      const initializeModel = require(modelFilePath); // Assuming modelFilePath exports a function

      // Check if initializeModel is a function before calling it
      if (typeof initializeModel === 'function') {
        await initializeModel(sequelizeInstance);
      } else {
        console.error(`${modelFilePath} does not export a function.`);
      }
    }
  }

  // Syncing models
  // await sequelizeInstance.models.role.sync({ alter: true });
  // await sequelizeInstance.models.admin.sync({ alter: true });
  // await sequelizeInstance.models.users.sync({ alter: true });
  // await sequelizeInstance.models.questionType.sync({ alter: true });
  // await sequelizeInstance.models.question.sync({ alter: true });
  // await sequelizeInstance.models.answers.sync({ alter: true });
  // await sequelizeInstance.models.report.sync({ alter: true });
  // await sequelizeInstance.models.Logs.sync({ alter: true });
  // await sequelizeInstance.models.UserSessions.sync({ alter: true });

  // Seeding data if SEED is enabled
  const isSeedMode = JSON.parse(SEED || false);
  if (isSeedMode) {
    console.log('Seeding ...');
    await sequelizeInstance.sync({ force: true });
  }

  return sequelizeInstance;
};

