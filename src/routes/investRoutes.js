// src/routes/investRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  buySlot,
  listUserInvestments,
  getInvestment
} from '../controllers/investController.js';

const router = express.Router();

// ⛔ All routes below must be protected
router.post('/:id/buy-slot', protect, buySlot);              // POST /api/investments/:id/buy-slot
router.get('/my',            protect, listUserInvestments);  // GET  /api/investments/my
router.get('/:id',           protect, getInvestment);        // GET  /api/investments/:id

export default router;



// // src/routes/investRoutes.js
// import express from 'express';
// import { protect } from '../middleware/auth.js';
// import { buySlot ,
//     listUserInvestments,
//     getInvestment
// } from '../controllers/investController.js';

// const router = express.Router();

// // POST /api/properties/:id/buy-slot
// router.post('/:id/buy-slot', buySlot);
// router.get('/my',      listUserInvestments);
// router.get('/:id',     getInvestment);

// export default router;
