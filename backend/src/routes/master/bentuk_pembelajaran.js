const express = require('express');
const router = express.Router();
const controller = require('../../controllers/master/bentuk_pembelajaran');
const authMiddleware = require('../../middlewares/auth');

router.get('/', authMiddleware.verifyToken, controller.index);

module.exports = router;
