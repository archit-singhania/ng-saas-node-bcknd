'use strict';
function validatePagination(req, res, next) {
  const page  = parseInt(req.query.page  || '1',  10);
  const limit = parseInt(req.query.limit || '15', 10);
  if (isNaN(page)  || page  < 1) return res.status(400).json({ error: 'Invalid page parameter' });
  if (isNaN(limit) || limit < 1) return res.status(400).json({ error: 'Invalid limit parameter' });
  next();
}
module.exports = { validatePagination };