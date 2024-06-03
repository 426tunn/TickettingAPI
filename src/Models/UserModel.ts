import mongoose, { Schema, Document, Types } from "mongoose";
import bcrypt from "bcrypt";
import { UserRole } from "../Enums/UserRole";

const passwordValidator = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$%&+,:;<=>?@^_`{|}~-])[a-zA-Z\d#$%&+,:;<=>?@^_`{|}~-]{8,}$/;
    return passwordRegex.test(password);
};

interface IUser extends Document {
    _id: Types.ObjectId;
    googleId?: string;
    username?: string;
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
    isVerified: boolean;
    role: UserRole;
    verificationToken?: string;
    verificationExpire?: Date;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    isValidPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    googleId: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: function() {
            return !this.googleId;
        },
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
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId;
        },
        validate: {
            validator: function(value: string) {
                return this.isModified("password") ? passwordValidator(value) : true;
            },
            message:
                "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        },
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.User,
    },
    verificationToken: String,
    verificationExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

export const hashPassword = async (password: string) => {
    const hash = await bcrypt.hash(password, 10);
    return hash;
};

userSchema.pre<IUser>("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await hashPassword(this.password);
    }
    next();
});

userSchema.methods.isValidPassword = async function (password: string) {
    const compare = await bcrypt.compare(password, this.password);
    return compare;
};

const UserModel = mongoose.model<IUser>("User", userSchema);
export { IUser, UserModel };
