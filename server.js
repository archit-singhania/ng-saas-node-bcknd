'use strict';
require('dotenv').config();
const app       = require('./src/app');
const appConfig = require('./src/config/app');

app.listen(appConfig.port);