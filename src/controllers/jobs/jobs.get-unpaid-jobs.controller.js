const { Op } = require('sequelize');
/**
 * @desc
 * GET /jobs/unpaid - Get all unpaid jobs for a user (either a client or contractor), for active contracts only.
 * @returns  all unpaid jobs
 */
exports.getUnpaidJobs = async function (req, res, next) {
  const {Contract, Job} = req.app.get('models');
  let jobs = await Job.findAll({
    where: {
      paid: {
        [Op.not]: true,
      },
    },
    include: {
      attributes: [],
      model: Contract,
      required: true,
      where: {
        status: {
          [Op.not]: 'terminated',
        },
        ...{[req.profile.type === 'client' ? 'ClientId' : 'ContractorId']: req.profile.id}
      },
    },
  });
  // todo: comeback and try a different approache
  res.json(jobs);
};

