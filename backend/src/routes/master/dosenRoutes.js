const express = require('express');
const router = express.Router();
const dosenController = require('../../controllers/master/dosenController');
const { verifyToken, authorize } = require('../../middlewares/auth');
const { UNITS } = require('../../config/permissions');

/**
 * ROUTES: Tabel Master Dosen
 */

router.use(verifyToken, authorize(UNITS.ADMIN));

// Get All Data
router.get('/', dosenController.index);

// Get Data by ID
router.get('/:id', dosenController.show);

// Create Data
router.post('/', dosenController.store);

// Update Data
router.put('/:id', dosenController.update);

// Delete Data
router.delete('/:id', dosenController.destroy);

module.exports = router;
