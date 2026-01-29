import express from 'express'
import availabilityController from './availability.controller.js';

const router = express.Router();

router.get('/getWorkingHours/:admin_id', availabilityController.getWorkingHours)

export default router;