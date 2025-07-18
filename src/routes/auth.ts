import express from 'express';
import { 
    login,
    register
} from '../controllers/auth.js';
 
const router = express.Router();

//localhost:3000/auth
router.post('/login', login);
router.post('/register', register);

export default router; 