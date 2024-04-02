import { Router } from "express";
import { UserController } from "../Controllers/UserController";
import { check } from "express-validator";
import { authenticateJWT, isAdminMiddleware } from '../Middlewares/AuthMiddleware';


const UserRouter = Router();
const userController = new UserController();


UserRouter.post(
    "/register",
    [
        check("username").notEmpty().withMessage("Username is required"),
        check("firstname").notEmpty().withMessage("First name is required"),
        check("lastname").notEmpty().withMessage("Last name is required"),
        check("email").isEmail().withMessage("Invalid email format"),
        check("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
    ],
    userController.registerUser,
);

UserRouter.post("/login", userController.loginUser);

UserRouter.get("/logout", userController.logoutUser);

UserRouter.get('/', authenticateJWT, isAdminMiddleware, userController.getAllUsers);

UserRouter.get('/:userId', authenticateJWT, isAdminMiddleware, userController.getUserById);

UserRouter.patch('/:userId', authenticateJWT, userController.updateUser);

UserRouter.patch('/role/:userId',  authenticateJWT,  isAdminMiddleware, userController.updateUserRole);

UserRouter.delete('/:userId',  authenticateJWT, userController.deleteUser);

//TODO: Add forgot password and reset password routes
//TODO: Add refresh token routes
//TODO: Add email verification
//TODO: Add email verification routes
//TODO: Add LOGOUT routes

/**
 * @openapi
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: testuser
 *               firstname: test
 *               lastname: user
 *               email: test@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: Successful user registration
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */


/**
 * @openapi
 * /api/v1/users/login:
 *   post:
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usernameOrEmail:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               usernameOrEmail: test@gmail.com
 *               password: password123
 *     responses:
 *       200:
 *         description: Successful user login
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */


/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Successful get all users
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

 /**
 * @openapi
 *   /api/v1/users/{userId}:
 *    get: 
 *     summary: Get user by id
 *     security: [{ bearerAuth: [] }]     
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The users id
 *     responses:
 *       200:
 *         description: Successful get user by id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

 /**
 * @openapi
 *   /api/v1/users/{userId}:
 *    patch: 
 *     summary: Update user by id
 *     security: [{ bearerAuth: [] }]  
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The users id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *             example:
 *               username: testUser
 *               firstname: John
 *               lastname: Doe
 *               email: test@example.com
 *               role: user
 *     responses:
 *       200:
 *         description: Successful update user by id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi  
 *   /api/v1/users/role/{userId}:
 *    put: 
 *     summary: Update user role by id
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The users id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *             example:
 *               role: admin
 *     responses:
 *       200:
 *         description: Successful update user role by id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
 
/**
 * @openapi
 *   /api/v1/users/{userId}:
 *    delete: 
 *     summary: Delete user by id
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The users id
 *     responses:
 *       200:
 *         description: Successful delete user by id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *
*/
export default UserRouter;
