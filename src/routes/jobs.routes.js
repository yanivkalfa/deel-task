const express = require('express');
const jobsRouter = express.Router();
const {getProfile} = require('../middleware/getProfile')

const {
  getUnpaidJobs,
  postPayForJob
} = require('../controllers/jobs');



// jobs
jobsRouter.all('*', getProfile);

// Path: /jobs/unpaid
// ==================================================
jobsRouter.route('/unpaid ')
  .get(getUnpaidJobs);

// Path: /jobs/:job_id/pay
// ==================================================
jobsRouter.route('/:job_id/pay')
  .post(postPayForJob);

//jobsRouter.param('param', fn);
module.exports = jobsRouter;