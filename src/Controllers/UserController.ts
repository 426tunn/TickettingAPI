import {Request, Response} from 'express';
import {UserService} from '../Services/UserService';
import jwt from 'jsonwebtoken';
import { IUser, UserModel } from '../Models/UserModel';
import { validationResult } from 'express-validator';
import { UserRole } from 'Enums/UserRole';
import { Config } from '../Config/config';
import {generateTokenWithRole, isEmail}  from '../Utils/authUtils';


export class UserController {
    private userService: UserService;
    constructor() {
        this.userService = new UserService(UserModel);
        this.registerUser = this.registerUser.bind(this);
        this.loginUser = this.loginUser.bind(this);
        this.logoutUser = this.logoutUser.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }
    async registerUser(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, firstname, lastname, email, password } = req.body;

        try {
            if (!this.userService) {
                return res
                    .status(500)
                    .json({ error: "User service is not initialized" });
            }
            const userEmailExists =
                await this.userService.getUserByEmail(email);
            const userUsernameExists =
                await this.userService.getUserByUsername(username);
            if (userUsernameExists) {
                return res
                    .status(409)
                    .json({ error: "username already exists" });
            } else if (userEmailExists) {
                return res.status(409).json({ error: "email already exists" });
            }
            const user = await this.userService.createUser(
                username,
                firstname,
                lastname,
                email,
                password,
            );
            res.status(201).json({ message: "Signup Sucessful", user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async loginUser(req: Request, res: Response) {
        try {
            const { usernameOrEmail, password } = req.body;
            let user: any;
            if (usernameOrEmail.includes("@")) {
                user = await this.userService.getUserByEmail(usernameOrEmail);
            } else {
                user =
                    await this.userService.getUserByUsername(usernameOrEmail);
            }
            if (!user) {
                return res
                    .status(401)
                    .json({ error: "Invalid email or password" });
            }
            const isPasswordValid = await user.isValidPassword(password);
            if (!isPasswordValid) {
                return res
                    .status(401)
                    .json({ error: "Invalid email or password" });
            }
            (req.session as any).user = user;
            const role = user.role;
            const token = generateTokenWithRole(user, role);
            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async logoutUser(req: Request, res: Response) {
        try {
            (req.session as any).destroy();
            res.status(200).json({ message: "Logout successful" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const role = (req as any).user.role;
            if(role !== 'admin'){
                return res.status(401).json({error: "Only Admin can access this route"});
            }
            const users = await this.userService.getAllUsers();
            res.status(200).json({ users });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const role = (req as any).user.role;
            if(role !== 'admin'){
                return res.status(401).json({error: "Only Admin can access this route"});
            }            
            const userId = req.params.userId;
            if (!userId) {
                return res.status(400).json({ error: "User ID is required" });
            }
            const user = await this.userService.getUserById(userId);
            res.status(200).json({ user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateUserRole(req: Request, res: Response){
        try {
            const role = (req as any).user.role;
            if(role !== "admin"){
                return res.status(401).json({error: "Only Admin can access this route"});
            }     
            const userId = req.params.userId;
            const roleToUpdate = req.body.role as UserRole;
            if (!userId) {
                return res.status(400).json({ error: "User ID is required" });
            }
            if (!roleToUpdate) {
                return res.status(400).json({error: 'Role is required'});
            }
            const updatedUser = await this.userService.updateUserRole(userId, roleToUpdate);
            if (!updatedUser) {
                return res.status(404).json({error: 'User not found'});
            }
            res.status(200).json({message: 'User role updated successfully', user: updatedUser});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }




    async updateUser(req: Request, res: Response) {
        try {               
            const userId = req.params.userId;
            if (!userId) {
                return res.status(400).json({ error: "User ID is required" });
            }
            const user = await this.userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({error: 'User not found'});
            } 
            if((req as any).user._id !== userId){
                return res
                .status(401)
                .json(
                    {error: "You can only edit your own user information"}
                    );
            }

            const updates : Partial<IUser> = req.body;
            if (Object.keys(updates).length === 0) {
                return res.status(400).json({error: 'No updates provided'});
            }
            if (updates.email && !isEmail(updates.email)) {
                return res.status(400).json({error: 'Invalid email'});
            }

            await this.userService.updateUser(userId, updates);
            const updatedUser = await this.userService.getUserById(userId);
            res.status(200).json({
                message: "User updated successfully",
                updatedUser,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    // async passwordReset(req: Request, res: Response){
    //     try {
    //         const email = req.body.email;
    //         if (!email) {
    //             return res.status(400).json({error: 'Email is required'});
    //         }
    //         const user = await this.userService.getUserByEmail(email);
    //         if (!user) {
    //             return res.status(404).json({error: 'User not found'});
    //         }
    //         user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    //         user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    //         await user.save();
    //         const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${user.resetPasswordToken}`;
    //         const html = `
    //         <p>Please make a PUT request to: ${resetUrl}</p>
    //         <p>Send password in the request body</p>`;
    //         await sendEmail({
    //             email: user.email,
    //             subject: 'Password Reset',
    //             html
    //         });
    //         res.status(200).json({message: 'Check your email for password reset instructions'})
    //     } catch (error) {
    //         res.status(500).json({error: error.message});
    //     }
    // }

    async deleteUser(req: Request, res: Response) {
        try {
            const role = (req as any).user.role;
            if(role !== 'admin'){
                return res.status(401).json({error: "Only Admin can access this route"});
            }                 
            const userId = req.params.userId;
            if (!userId) {
                return res.status(400).json({ error: "User ID is required" });
            }
            const user = await this.userService.deleteUser(userId);
            res.status(200).json({
                message: "User deleted successfully",
                user,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    }
