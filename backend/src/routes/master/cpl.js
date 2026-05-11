const express = require('express');
const router = express.Router();
const cplController = require('../../controllers/master/cpl');

const { verifyToken, authorize } = require('../../middlewares/auth');
const { UNITS } = require('../../config/permissions');

router.use(verifyToken, authorize(UNITS.PRODI, UNITS.ADMIN));

router.get('/', cplController.index);
router.get('/:id', cplController.show);
router.post('/', cplController.store);
router.put('/:id', cplController.update);
router.delete('/:id', cplController.destroy);

module.exports = router;
