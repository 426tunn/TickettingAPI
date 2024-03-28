import { Model } from 'mongoose';
import { UserModel, IUser } from '../Models/UserModel';
import { UserRole } from 'Enums/UserRole';

export class UserService {
  private userModel: Model<IUser>;

  constructor(userModel: Model<IUser>) {
    this.userModel = userModel;
  }

  async createUser(username: string, firstname: string, lastname: string, email: string, password: string): Promise<IUser> {

    try {
      const newUser = new this.userModel({
        username, 
        email,
        firstname,
        lastname,
         password });
   return await newUser.save();
      
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }

  }

  async getUserById(userId: string): Promise<IUser | null> {
    return await this.userModel.findById(userId).exec();
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await this.userModel.findOne({ username }).exec();
  }


  async updateUserRole(userId: string, role: UserRole): Promise<IUser | null> {
    return await this.userModel.findByIdAndUpdate(userId, { role }, { new: true }).exec();
  }


  async updateUser(userId: string, updates: Partial<IUser>): Promise<IUser | null> {
    return await this.userModel.findByIdAndUpdate(userId, updates, { new: true }).exec();
  }

  async getAllUsers(): Promise<IUser[]> {
    return await this.userModel.find().exec();
  }

  async deleteUser(userId: string): Promise<IUser | null> {
    return await this.userModel.findByIdAndDelete(userId).exec();
  }
}