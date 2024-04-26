const { Op } = require('sequelize');
/**
 * @desc
 * GET /contracts - Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.
 * @returns  all active contracts
 */
exports.getAllContracts = async function (req, res, next) {
  const {Contract} = req.app.get('models');
  const contracts = await Contract.findAll({
    where: {
      status: {
        [Op.not]: 'terminated',
      },
      ...{[req.profile.type === 'client' ? 'ClientId' : 'ContractorId']: req.profile.id}
    }}
  );
  if(!contracts.length) return res.status(404).end();
  res.json(contracts);
};

