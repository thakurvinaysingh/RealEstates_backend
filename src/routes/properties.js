import express from 'express';
import { listProperties, getProperty } from '../controllers/propertyController.js';

const router = express.Router();
router.get('/',    listProperties);
router.get('/:id', getProperty);
export default router;