import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { uploadImages }  from '../middleware/upload.js';
import {
  createProperty,
  updateProperty,
  deleteProperty
} from '../controllers/adminController.js';

const router = express.Router();

// all routes require admin
// router.use(protect, admin);

router.post('/', uploadImages.array('images', 10), createProperty);
router.put('/:id', uploadImages.array('images', 10), updateProperty);
router.delete('/:id', deleteProperty);

export default router;
