import express from 'express';
import {registerUser, loginUser, logoutUser, updateProfile} from '../controllers/auth.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/multer.middleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.patch(
    '/update-profile', 
    isAuthenticated, 
    upload.single('avatar'), 
    updateProfile
);

export default router;