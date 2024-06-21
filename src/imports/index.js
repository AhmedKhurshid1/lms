/** Local static Objects & dependencies */
const AppData = require('./appData');

const Errors = require('./errors');

const Statics = require('./statics');

const BaseSchemaModel = require('./baseSchema');

const SeedData = require('./seedData');


module.exports = {
  AppData,
  Errors,
  Statics,
  ...BaseSchemaModel,
  SeedData,
}
