import { Model } from "mongoose";
import { Profile } from "passport-google-oauth20";
import { IUser } from "../Models/UserModel";
import { UserRole } from "../Enums/UserRole";
import { generateSecurePassword } from "../Utils/authUtils";

export class UserService {
    private userModel: Model<IUser>;

    constructor(userModel: Model<IUser>) {
        this.userModel = userModel;
    }

    async createUser(
        username: string,
        firstname: string,
        lastname: string,
        email: string,
        password: string,
        verificationToken?: string,
        verificationExpire?: Date,
    ): Promise<IUser> {
        try {
            return await this.userModel.create({
                username,
                email,
                firstname,
                lastname,
                password,
                verificationToken,
                verificationExpire,
            });
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    async createUserWithGoogle(profile: Profile): Promise<IUser> {
        const securedPassword = generateSecurePassword();
        const newUser = new this.userModel({
            googleId: profile.id,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            email: profile.emails[0].value,
            username: profile.emails[0].value.split("@")[0],
            password: securedPassword,
            isVerified: true,
        });
        return newUser.save();
    }

    async getUserById(userId: string): Promise<IUser | null> {
        return await this.userModel.findById(userId).exec();
    }

    async getUserByGoogleId(googleId: string): Promise<IUser | null> {
        return this.userModel.findOne({ googleId });
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        return await this.userModel.findOne({ email }).exec();
    }

    async getUserByUsername(username: string): Promise<IUser | null> {
        return await this.userModel.findOne({ username }).exec();
    }

    async updateUserRole(
        userId: string,
        role: UserRole,
    ): Promise<IUser | null> {
        return await this.userModel
            .findByIdAndUpdate(userId, { role }, { new: true })
            .select("-password -verificationToken -verificationExpire")
            .exec();
    }

    async updateUser(
        userId: string,
        updates: Partial<IUser>,
    ): Promise<IUser | null> {
        return await this.userModel
            .findByIdAndUpdate(userId, updates, { new: true })
            .select("-password -verificationToken -verificationExpire")
            .exec();
    }

    async getAllUsers(): Promise<IUser[]> {
        return await this.userModel
            .find()
            .select("-password -verificationToken -verificationExpire")
            .exec();
    }

    async deleteUser(userId: string): Promise<IUser | null> {
        return await this.userModel.findByIdAndDelete(userId).exec();
    }

    async getUserByResetToken(resetToken: string): Promise<IUser | null> {
        return await this.userModel
            .findOne({ resetPasswordToken: resetToken })
            .select("-password -verificationToken -verificationExpire");
    }

    async getUserByVerificationToken(
        verificationToken: string,
    ): Promise<IUser | null> {
        return await this.userModel
            .findOne({
                verificationToken: verificationToken,
            })
            .select("-password -verificationToken -verificationExpire");
    }

    async verifyUser(userId: string): Promise<IUser | null> {
        return await this.userModel
            .findByIdAndUpdate(userId, { isVerified: true }, { new: true })
            .select("-password -verificationToken -verificationExpire")
            .exec();
    }
}
