import express from 'express'
import availabilityController from './availability.controller.js';
import verifyToken from '../../middlewares/verifyToken.js';

const router = express.Router();

router.get('/getWorkingHours/:adminId', verifyToken, availabilityController.getWorkingHours)
router.post('/newAvailability', verifyToken, availabilityController.newAvailability)
router.put('/editAvailability/:availability_id', verifyToken, availabilityController.editAvailability)
router.delete('/delAvailability/:availability_id', verifyToken, availabilityController.delAvailability)

export default router;