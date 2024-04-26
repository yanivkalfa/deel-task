/**
 * @desc
 * GET /contracts/:id - This API is broken 😵! it should return the contract only if it belongs to the profile calling. better fix that!
 * @returns contract by id
 */
exports.getContractById = async function (req, res, next) {
  const {Contract} = req.app.get('models');
  const {id} = req.params;
  const contract = await Contract.findOne({
    where: {
      id,
      ...{[req.profile.type === 'client' ? 'ClientId' : 'ContractorId']: req.profile.id}
    }}
  );
  if(!contract) return res.status(404).end();
  res.json(contract);
};