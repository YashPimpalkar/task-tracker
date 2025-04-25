import express from 'express';
import { getUserDetails, login, register } from '../controllers/authController.js';
const router = express.Router();

router.post('/register',register);
router.post('/login', login);
// ... existing routes ...
router.get('/user/:id', getUserDetails);

export default router;