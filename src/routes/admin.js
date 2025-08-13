import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { uploadImages }  from '../middleware/upload.js';
import {
  createProperty,
  updateProperty,
  deleteProperty
} from '../controllers/adminController.js';
import {
  listUsers,
  setUserStatus,
  getUserInvestmentDetails
} from '../controllers/adminUserController.js';


const router = express.Router();

// all routes require admin
// router.use(protect, admin);

router.post('/', uploadImages.array('images', 10), createProperty);
router.put('/:id', uploadImages.array('images', 10), updateProperty);
router.delete('/:id', deleteProperty);




// ── User admin ────────────────────────────────
// GET /api/admin/users?status=active|blocked
router.get('/users', listUsers);

// PATCH /api/admin/users/:id/status { status: "active" | "blocked" }
router.patch('/users/:id/status', setUserStatus);

// GET /api/admin/users/:userId/investments
router.get('/users/:userId/investments', getUserInvestmentDetails);

export default router;
