'use strict';
require('dotenv').config();

module.exports = {
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME     || 'demo_db',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
  schema:   process.env.DB_SCHEMA   || 'llm_ai_call_agent',
};
