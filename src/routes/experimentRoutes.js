const express = require('express');
const router = express.Router();
const experimentController = require('../controllers/experimentController');
const validateRequest = require('../middleware/validateRequest');
const { createExperimentSchema, updateExperimentSchema } = require('../utils/validation');

// Create experiment
router.post('/', validateRequest(createExperimentSchema), experimentController.createExperiment);

// Get all experiments
router.get('/', experimentController.getAllExperiments);

// Get statistics
router.get('/stats/overview', experimentController.getExperimentStats);

// Get experiment by ID
router.get('/:id', experimentController.getExperimentById);

// Update experiment
router.put('/:id', validateRequest(updateExperimentSchema), experimentController.updateExperiment);

// Delete experiment
router.delete('/:id', experimentController.deleteExperiment);

module.exports = router;
