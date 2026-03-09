import { Document } from 'mongoose';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    
   
    phoneNumber?: string;
    avatar?: {
        public_id: string;
        url: string;
    };
    address?: {
        street?: string;
        city?: string;
        country?: string;
        zipCode?: string;
    };
    isVerified?: boolean;
    createdAt: Date;
    updatedAt: Date;
}