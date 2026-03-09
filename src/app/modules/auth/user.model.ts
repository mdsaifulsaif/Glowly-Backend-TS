import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';

const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    
    phoneNumber: { type: String },
    avatar: {
        public_id: { type: String },
        url: { type: String, default: "https://example.com/default-avatar.png" }
    },
    address: {
        street: String,
        city: String,
        country: String,
        zipCode: String
    },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);