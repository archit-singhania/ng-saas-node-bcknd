'use strict';
const dbConfig = require('../config/db');

const TABLE = `"${dbConfig.schema}"."call_logs"`;

module.exports = { TABLE };
