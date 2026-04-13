'use strict';
const router     = require('express').Router();
const controller = require('../controllers/calls.controller');
const { validatePagination } = require('../validations/calls.validation');

router.get('/summary', controller.summary);
router.get('/recent',  controller.recent);
router.get('/',        validatePagination, controller.list);

module.exports = router;