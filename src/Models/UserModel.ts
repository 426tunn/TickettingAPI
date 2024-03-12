import { Schema, Document, model, Types } from "mongoose";
import bcrypt from "bcrypt";
import { UserRole } from "../Enums/UserRole";



interface UserDocument extends Document {
    userId:  Types.ObjectId;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    isAdmin: boolean;
    role: UserRole;
}

const userSchema = new Schema<UserDocument>({
    userId: { type:  Schema.Types.ObjectId, default: () => new Types.ObjectId() },
    username: { type: String, required: true, maxlength: 50 },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.User }
});

export default model<UserDocument>('User', userSchema);