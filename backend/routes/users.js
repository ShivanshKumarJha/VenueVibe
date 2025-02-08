import express from 'express';
import {getUser, postLogin, postSignup, updateUser} from "../controllers/user_controller.js";
import {upload} from "../config/multer.js";
import {isAuth} from "../middleware/isAuth.js";

const router = express.Router();

router.get('/:userId', isAuth, getUser);
router.post('/signup', upload.single('image'), postSignup);
router.post('/login', postLogin);
router.patch('/:userId', isAuth, upload.single('image'), updateUser);

export default router;