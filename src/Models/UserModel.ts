import mongoose, { Schema, Document, Types } from "mongoose";
import bcrypt from "bcrypt";
import { UserRole } from "../Enums/UserRole";

interface IUser extends Document {
    _id: Types.ObjectId;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    isAdmin: boolean;
    role: UserRole;

    isValidPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        maxlength: 50,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: { type: String, required: true },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.User,
    },
});

userSchema.pre<IUser>("save", async function (next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

userSchema.methods.isValidPassword = async function (password: string) {
    const compare = await bcrypt.compare(password, this.password);
    return compare;
};

const UserModel = mongoose.model<IUser>("User", userSchema);
export { IUser, UserModel };
