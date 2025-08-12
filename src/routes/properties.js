import express from 'express';
import { listProperties, getProperty ,getPropertyBySlug} from '../controllers/propertyController.js';

const router = express.Router();
router.get('/',    listProperties);
router.get('/slug/:slug', getPropertyBySlug);

router.get('/:id', getProperty);
export default router;