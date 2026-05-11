const express = require('express');
const router = express.Router();
const prodiController = require('../../controllers/master/prodiController');
const { verifyToken, authorize } = require('../../middlewares/auth');
const { UNITS } = require('../../config/permissions');

/**
 * ROUTES: Tabel Master Program Studi (Prodi)
 */

router.use(verifyToken, authorize(UNITS.ADMIN));

// Get All Data
router.get('/', prodiController.index);

// Get Data by ID
router.get('/:id', prodiController.show);

// Create Data
router.post('/', prodiController.store);

// Update Data
router.put('/:id', prodiController.update);

// Delete Data
router.delete('/:id', prodiController.destroy);

module.exports = router;
