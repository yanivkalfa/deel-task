const express = require('express');
const balanceRouter = express.Router();
const {getProfile} = require('../middleware/getProfile');

const {
  postDepositToBalance,
} = require('../controllers/balance');



// balance
balanceRouter.all('*', getProfile);

// Path: balances/deposit/:userId
// body: amount=<amount>
// ==================================================
balanceRouter.route('/deposit/:userId')
  .post(postDepositToBalance);

module.exports = balanceRouter;