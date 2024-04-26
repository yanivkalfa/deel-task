const express = require('express');
const adminRouter = express.Router();
const {getProfile} = require('../middleware/getProfile')

const {
  getBestClients,
  getBestProfessions
} = require('../controllers/admin');


// admin
adminRouter.all('*', getProfile);

// Path: /admin/best-profession
// Query: start=<date>&end=<date>
// ==================================================
adminRouter.route('/best-profession')
  .get(getBestProfessions);

// Path: /admin/best-clients
// Query: start=<date>&end=<date>&limit=<integer>
// ==================================================
adminRouter.route('/best-clients')
  .get(getBestClients);

module.exports = adminRouter;