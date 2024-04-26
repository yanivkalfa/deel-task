const { Op } = require('sequelize');
/**
 * @desc
 * POST /balance/deposit/:userId - Deposits money into the the the balance of a client,
 * a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
 * @returns  status
 */
exports.postDepositToBalance = async function (req, res, next) {
  const { Profile, Job, Contract } = req.app.get('models');
  const { userId } = req.params;
  const { amount } = req.body;
  const percentages = 25;

  if (typeof amount === 'undefined' || !isFinite(amount)) return res.status(400).end('amount not specified or not a number');

  const client = await Profile.findOne({
    where: { id: userId }
  });

  if (!client) return res.status(404).end('Client not found');

  const unpaid = await Job.sum('price', {
    where: {
      paid: {
        [Op.not]: true,
      }
    },
    include: [
      {
        required: true,
        model: Contract,
        include: [
          {
            required: true,
            model: Profile,
            as: 'Client',
            where: { id: userId }
          }
        ]
      }
    ]
  });

  const depositLimit = unpaid * percentages / 100;
  if (amount >= depositLimit) {
    return res.status(400).end(`client can\'t deposit more than ${percentages}% his total of jobs to pay.`);
  }
  client.balance += amount;
  await client.save();

  return res.status(200).end(`success: new balance ${client.balance}`);
};

