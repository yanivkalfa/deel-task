const { NOW } = require('sequelize');
const {sequelize} = require('../../model');
/**
 * @desc
 * POST /jobs/:job_id/pay - Pay for a job, a client can only pay if his balance >= the amount to pay.
 * The amount should be moved from the client's balance to the contractor balance.
 *
 * @returns  status
 */
exports.postPayForJob = async function (req, res, next) {
  const {Contract, Job, Profile} = req.app.get('models');
  const {job_id} = req.params;
  const profileId = req.profile.id;

  if(req.profile.type !== 'client')  return res.status(400).end('error: you are not a client');

  try {
    await sequelize.transaction(async (t) => {
      const options = {transaction: t};
      const job = await Job.findOne({
        where: {
          id: job_id,
          /*-- if we want cleaner solution with less error logging(without using custom errors)
          paid: {
            [Op.not]: true,
          },
          */
        },
        include: {
          model: Contract,
          where: {
            ClientId: profileId
          },
          include: [
            {
              model: Profile, as: 'Contractor',
            },
            {
              model: Profile, as: 'Client',
              /*-- if we want cleaner solution with less error logging(without using custom errors)
              where: {
                balance: {
                  [Op.gt]: {[Op.col]: 'Job.price'}
                }
              }
              */
            }
          ]
        },
        lock: t.LOCK.UPDATE,
        ...options,
      });

      if(!job) return res.status(404).end('error: job not found');
      if(job.paid) return res.status(400).end('error: job is paid');
      if(job.price > job.Contract.Client.balance) return res.status(400).end('error: balance is insufficient');

      job.paid = true;
      job.paymentDate = NOW;
      job.Contract.Client.balance -= job.price;
      job.Contract.Contractor.balance += job.price;

      await job.save(options);
      await job.Contract.Client.save(options);
      await job.Contract.Contractor.save(options);
      return res.status(200).end('success:');
    });
  }
  catch (err) {
    return res.status(400).end(err);
  }
};

