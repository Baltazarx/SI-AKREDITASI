const express = require('express');
const router = express.Router();
const tendikController = require('../../controllers/master/tendikController');
const { verifyToken, authorize } = require('../../middlewares/auth');
const { UNITS } = require('../../config/permissions');

/**
 * ROUTES: Tabel Master Tenaga Kependidikan
 */

router.use(verifyToken, authorize(UNITS.ADMIN));

// Get All Data
router.get('/', tendikController.index);

// Get Data by ID
router.get('/:id', tendikController.show);

// Create Data
router.post('/', tendikController.store);

// Update Data
router.put('/:id', tendikController.update);

// Delete Data
router.delete('/:id', tendikController.destroy);

module.exports = router;
