import {Request, Response} from 'express';
import {UserService} from '../Services/UserService';
import jwt from 'jsonwebtoken';
import { UserModel } from '../Models/UserModel';
import { validationResult } from 'express-validator';


export class UserController {
    private userService: UserService;
constructor(){
    this.userService = new UserService(UserModel);
    this.registerUser = this.registerUser.bind(this);
}
    async registerUser(req: Request, res: Response){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { username, firstname, lastname, email, password } = req.body;

        try {
            
            if (!this.userService) {
                return res.status(500).json({error: 'User service is not initialized'});
            }
            const userEmailExists = await this.userService.getUserByEmail(email);
            const userUsernameExists = await this.userService.getUserByUsername(username);
            if (userUsernameExists) {
                return res.status(409).json({error: 'username already exists'});
            } else if (userEmailExists) {
                return res.status(409).json({error: 'email already exists'});
            }
            const user = await this.userService.createUser(username, firstname, lastname, email, password);
            res.status(201).json({message: 'Signup Sucessful', user});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async loginUser(req: Request, res: Response){
        try {
            const {usernameOrEmail, password} = req.body;
            let user: any;
            if (usernameOrEmail.includes('@')) {
                user = await this.userService.getUserByEmail(usernameOrEmail);
            } else {
                user = await this.userService.getUserByUsername(usernameOrEmail);
            }
            if (!user) {
                return res.status(401).json({error: 'Invalid email or password'});
            }
            const isPasswordValid = await user.isValidPassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({error: 'Invalid email or password'});
            }
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET as string, {expiresIn: '1h'});
            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async getAllUsers(req: Request, res: Response){
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json({users});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async getUserById(req: Request, res: Response){
        try {
            const userId = req.params.userId;
            if (!userId) {
                return res.status(400).json({error: 'User ID is required'});
            }
            const user = await this.userService.getUserById(userId);
            res.status(200).json({user});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async deleteUser(req: Request, res: Response){
        try {
            const userId = req.params.userId;
            if (!userId) {
                return res.status(400).json({error: 'User ID is required'});
            }
            const user = await this.userService.deleteUser(userId);
            res.status(200).json({message: 'User deleted successfully', user});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    }


    //compare with your other proj first