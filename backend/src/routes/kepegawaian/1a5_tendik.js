const express = require('express');
const router = express.Router();
const controller1a5 = require('../../controllers/kepegawaian/1a5_tendik');
const { verifyToken, authorize } = require('../../middlewares/auth');

// Hanya butuh verifyToken untuk memastikan yang akses adalah orang dalam kampus
router.get('/', verifyToken, controller1a5.index);
router.get('/export', verifyToken, controller1a5.exportExcel);

module.exports = router;