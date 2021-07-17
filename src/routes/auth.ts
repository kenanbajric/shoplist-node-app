// core imports
import express from 'express';

// my imports
import isAuth from '../middleware/is-auth';
import { signup, login, updatePassword } from '../controllers/auth';

const router: any = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/updatePassword', isAuth, updatePassword);

module.exports = router;