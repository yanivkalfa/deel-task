const express = require('express');
const contractsRouter = express.Router();
const {getProfile} = require('../middleware/getProfile')

const {
  getContractById,
  getAllContracts
} = require('../controllers/contracts');



// contracts
contractsRouter.all('*', getProfile);

// Path: /contracts/:id
// ==================================================
contractsRouter.route('/:id')
  .get(getContractById);

// Path: /contracts/
// ==================================================
contractsRouter.route('/')
  .get(getAllContracts);

//contractsRouter.param('param', fn);
module.exports = contractsRouter;

