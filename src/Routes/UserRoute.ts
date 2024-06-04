import { Router } from "express";
import { UserController } from "../Controllers/UserController";
import { check } from "express-validator";
import {
    authenticateJWT,
    // checkIfUserIsAdmin,
    checkRevokedToken,
} from "../Middlewares/AuthMiddleware";

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

UserRouter.post(
    "/login",
     userController.loginUser
);

UserRouter.post("/logout", userController.logoutUser);

UserRouter.get(
    "/get-token-user",
    authenticateJWT,
    checkRevokedToken,
    userController.getUserByToken,
);

UserRouter.get(
    "/verify-email", 
    userController.verifyUser
);

UserRouter.post(
    "/resend-verification-email",
    authenticateJWT,
    userController.reverifyUser,
);

UserRouter.post(
    "/forgot-password", 
    userController.forgotPassword);

UserRouter.post(
    "/reset-password", 
    userController.resetPassword
);

UserRouter.post(
    "/change-password",
    authenticateJWT,
    userController.changePassword,
);

UserRouter.get(
    "/",
    authenticateJWT,
    checkRevokedToken,
    // checkIfUserIsAdmin,
    userController.getAllUsers,
);

UserRouter.get(
    "/:userId",
    authenticateJWT,
    // checkIfUserIsAdmin,
    userController.getUserById,
);

UserRouter.patch(
    "/:userId", 
    authenticateJWT, 
    userController.updateUser
);

UserRouter.patch(
    "/role/:userId",
    authenticateJWT,
    // checkIfUserIsAdmin,
    userController.updateUserRole,
);

UserRouter.delete(
    "/:userId", 
    authenticateJWT,
    // checkIfUserIsAdmin,
    userController.deleteUser);

/**
 * @openapi
 * /api/v1/users/register:
 *   post:
 *     tags:
 *       - User Management
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
 *     tags:
 *       - User Management
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
 * /api/v1/users/logout:
 *   post:
 *     tags:
 *       - User Management
 *     summary: Logout user
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Successful logout
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
 *     tags:
 *       - User Management
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
 *     tags:
 *       - User Management
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
 * /api/v1/users/get-token-user:
 *   get:
 *     tags:
 *       - User Management
 *     summary: Get user by token
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Successful get user by token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/users/verify-email:
 *   get:
 *     tags:
 *       - User Management
 *     summary: Verify user
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Successful verification
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: User already verified
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/users/resend-verification-email:
 *   post:
 *     tags:
 *       - User Management
 *     summary: Resend verification email
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Successful resend verification email
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/users/forgot-password:
 *   post:
 *     tags:
 *       - User Management
 *     summary: Forgot password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               oldPassword:
 *                 type: string
 *             example:
 *               email: example@example.com
 *               password: password123
 *               oldPassword: password123
 *     responses:
 *       200:
 *         description: Successful forgot password email
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: User doesn't exist or wrong password
 *       500:
 *         description: Internal server error
 */


/**
 * @openapi
 *   /api/v1/users/{userId}:
 *    patch:
 *     tags:
 *       - User Management
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
 * /api/v1/users/reset-password:
 *   patch:
 *     tags:
 *       - User Management
 *     summary: Reset password
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               oldPassword:
 *                 type: string
 *             example:
 *               password: newpassword123
 *               oldPassword: password123
 *     responses:
 *       200:
 *         description: Successful reset password
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Wrong old password
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/users/change-password:
 *   patch:
 *     tags:
 *       - User Management
 *     summary: Change password
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               oldPassword:
 *                 type: string
 *             example:
 *               password: newpassword123
 *               oldPassword: password123
 *     responses:
 *       200:
 *         description: Successful change password
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Wrong old password
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/users/role/:userId:
 *   patch:
 *     tags:
 *       - User Management
 *     summary: Update user role
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 role:
 *                   type: string
 *                   enum: ["superadmin", "admin", "user"]
 *               example:
 *                   role: user
 *     responses:
 *       200:
 *         description: Successful update user role
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       409:
 *         description: User already has the specified role
 *       500:
 *         description: Internal server error
 */



/**
 * @openapi
 *   /api/v1/users/{userId}:
 *    delete:
 *     tags:
 *       - User Management
 *     summary: Delete user by id
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
