'use strict';
const callsService = require('../services/calls.service');

async function summary(req, res, next) {
  try {
    const data = await callsService.getSummary();
    res.json(data);
  } catch (err) { next(err); }
}

async function recent(req, res, next) {
  try {
    const data = await callsService.getRecentCalls();
    res.json(data);
  } catch (err) { next(err); }
}

async function list(req, res, next) {
  try {
    const page  = Math.max(1, parseInt(req.query.page  || '1',  10));
    const limit = Math.max(1, parseInt(req.query.limit || '15', 10));
    const data  = await callsService.getAllCalls(page, limit);
    res.json(data);
  } catch (err) { next(err); }
}

module.exports = { summary, recent, list };