const {getAllContracts} = require('./contracts.get-all-contracts.controller');
const {getContractById} = require('./contracts.get-contract-by-id.controller');

module.exports = {
  getAllContracts,
  getContractById,
};
