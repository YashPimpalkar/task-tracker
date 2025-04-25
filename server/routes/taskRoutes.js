import express from 'express';

import { createtask, deletetask, getalltaskbyuser, updatetask } from '../controllers/taskController.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();

router.post('/', authenticateToken,createtask);
router.get('/:projectId', authenticateToken, getalltaskbyuser);
router.put('/:id', authenticateToken, updatetask);
router.delete('/:id', authenticateToken,deletetask);

export default router;