const { Op, fn, col } = require('sequelize');
/**
 * @desc
 * GET /admin/best-clients?start=<date>&end=<date>&limit=<integer> - returns the clients the paid the most for
 * jobs in the query time period. limit query parameter should be applied, default limit is 2.
 * @returns  status
 */
exports.getBestClients = async function (req, res, next) {
  const { Contract, Profile, Job } = req.app.get('models');
  const { start, end, limit } = req.query;

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (!isFinite(startDate) || !isFinite(endDate)) return res.status(500).end('Date is invalid');
  let parsedLimit = isFinite(parseInt(limit)) ? parseInt(limit) : 10;
  const topClients = await Job.findAll( {
    attributes: [
      [col('Contract.Client.id'), 'id'],
      [fn('SUM', col('price')), 'paid'],
      [fn('concat', col('Contract.Client.firstName'), ' ' ,col('Contract.Client.lastName')), 'fullName'],
    ],
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [startDate, endDate]
      }
    },
    order: [['paid', 'DESC']],
    group: 'Contract.Client.id',
    limit: parsedLimit,
    include: [
      {
        attributes:[],
        model: Contract,
        include: [
          {
            model: Profile,
            as: 'Client',
            where: { type: 'client' },
          }
        ]
      }
    ]
  });

  res.json(topClients);
};

