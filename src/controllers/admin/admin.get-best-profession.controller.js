const { Op, fn, col } = require('sequelize');
/**
 * @desc
 * GET /admin/best-profession?start=<date>&end=<date> - Returns the profession that earned the most money (sum of jobs paid)
 * for any contactor that worked in the query time range.
 * @returns  status
 */
exports.getBestProfessions = async function (req, res, next) {
  const { Contract, Profile, Job } = req.app.get('models');
  const { start, end } = req.query;

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (!isFinite(startDate) || !isFinite(endDate)) return res.status(500).end('Date is invalid');
  console.log('startDate', endDate);
  console.log('endDate, ', endDate);
  const topProfessions = await Job.findAll( {
    attributes: [
      // include the summed value here
      [fn('SUM', col('price')), 'priceSum'],
      [col('Contract.Contractor.profession'), 'profession']
    ],
    where: {
      paid: true,
      [Op.or]: [
        {
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        },
        {
          updatedAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      ]
    },
    order: [['priceSum', 'DESC']],
    group: 'Contract.Contractor.profession',
    include: [
      {
        attributes: [],
        model: Contract,
        include: [
          {
            model: Profile,
            as: 'Contractor',
            where: { type: 'contractor' },
          }
        ]
      }
    ]
  });
  console.log(topProfessions.length);
  if (!topProfessions || !topProfessions.length) return res.status(404).end('No records found');
  return res.status(200).end(`success: Top Profession is: ${topProfessions[0].dataValues.profession} with: ${topProfessions[0].dataValues.priceSum} earning`);
};

