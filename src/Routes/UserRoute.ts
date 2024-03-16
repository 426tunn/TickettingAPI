import { Router } from 'express';
import { UserController } from "../Controllers/UserController";
import { check, body } from 'express-validator';

const UserRouter = Router();
const userController = new UserController();

UserRouter.post('/register',  [
    check('username').notEmpty().withMessage('Username is required'),
    check('firstname').notEmpty().withMessage('First name is required'),
    check('lastname').notEmpty().withMessage('Last name is required'),
    check('email').isEmail().withMessage('Invalid email format'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], userController.registerUser);

UserRouter.post('/login', userController.loginUser);


// UserRouter.get('/profile', userController.getUserProfile);

// UserRouter.put('/profile', userController.updateUserProfile);

// Add other routes as needed

export default UserRouter;