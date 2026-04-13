'use strict';
const express    = require('express');
const cors       = require('cors');
const appConfig  = require('../config/app');
const callRoutes = require('../routes/calls.routes');
const errorHandler = require('../middlewares/errorHandler');
const notFound     = require('../middlewares/notFound');

const app = express();

app.use(cors({ origin: appConfig.allowedOrigin }));
app.use(express.json());

// Routes
app.use('/api/calls', callRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// 404 & global error handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;
