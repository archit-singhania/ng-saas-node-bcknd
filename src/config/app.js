'use strict';
require('dotenv').config();

module.exports = {
  port:        parseInt(process.env.PORT || '3000', 10),
  allowedOrigin: process.env.ALLOWED_ORIGIN || 'http://localhost:4200',
  nodeEnv:     process.env.NODE_ENV || 'development',
};
