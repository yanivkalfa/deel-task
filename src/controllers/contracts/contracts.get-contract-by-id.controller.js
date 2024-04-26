/**
 * FIX ME!
 * @returns contract by id
 */
exports.getContractById = async function (req, res, next) {
  const {Contract} = req.app.get('models');
  const {id} = req.params;
  const contract = await Contract.findOne({where: {id}});
  if(!contract) return res.status(404).end();
  res.json(contract);
};