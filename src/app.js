const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model');

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use('/admin', require('./routes/admin.routes'));
app.use('/balance', require('./routes/balance.routes'));
app.use('/contracts', require('./routes/contracts.routes'));
app.use('/jobs', require('./routes/jobs.routes'));

module.exports = app;

