'use strict';
const { Pool } = require('pg');
const dbConfig = require('../config/db');

const pool = new Pool({
  host:     dbConfig.host,
  port:     dbConfig.port,
  database: dbConfig.database,
  user:     dbConfig.user,
  password: dbConfig.password,
});

pool.on('error', () => {});

module.exports = pool;
