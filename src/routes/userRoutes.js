// routes/user.routes.js
import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { uploadAvatar } from '../middleware/upload.js';
import {
  getMe, updateMe, changePassword,
  getMyInvestments, getMyStats
} from '../controllers/userController.js';

const router = Router();

router.get('/me', protect, getMe);
router.patch('/me', protect, uploadAvatar.single('avatar'), updateMe);
router.patch('/me/password', protect, changePassword);

router.get('/me/investments', protect, getMyInvestments);
router.get('/me/stats', protect, getMyStats);

export default router;

