/** Third party dependencies*/
const { Router } = require('express');
const { schemaValidator } = require('../../middlewares');


/** Local dependencies and functions */


const { 
    // syncTable, seedDB, encrypt, decrypt, deleteUsers, deleteAdmins, notificationTest, deletes3Directory, deleteUsersFromDB, 
    cognitoLogin } = require('./utils.controller');


const router = Router();


/** 
 * @todo - create a SaaS Stretegy for Yard Events API as a SaaS or Paas
 * Unmounted the signup route for Yard Events API distribution to be provided to TGS, solution
 * customized for Genetec.
 */
router
    .post(
        '/cognitoLogin',
        cognitoLogin
    )

module.exports = router;
