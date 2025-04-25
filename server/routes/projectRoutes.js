import express from 'express';
import { createProject, deleteProject, getProjectsByUser } from '../controllers/projectController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createProject)
router.get('/:uid', authenticateToken, getProjectsByUser);
router.delete('/:id', authenticateToken, deleteProject);
export default router;