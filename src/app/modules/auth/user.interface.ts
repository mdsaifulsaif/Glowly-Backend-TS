// import { Document } from 'mongoose';

// export interface IUser extends Document {
//     firstName: string;
//     lastName: string;
//     email: string;
//     password: string;
//     role: 'user' | 'admin';
    
   
//     phoneNumber?: string;
//     avatar?: {
//         public_id: string;
//         url: string;
//     };
//     address?: {
//         street?: string;
//         city?: string;
//         country?: string;
//         zipCode?: string;
//     };
//     isVerified?: boolean;
//     createdAt: Date;
//     updatedAt: Date;
// }


import { Document, Model } from 'mongoose';

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
    // নাম পরিবর্তন করা হলো
    shippingAddress?: {
        addressLine?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };
    isVerified?: boolean;
}

// স্ট্যাটিক মেথডের জন্য এই ইন্টারফেসটি জরুরি
export interface IUserModel extends Model<IUser> {
    isPasswordMatched(password: string, hashedPassword: string): Promise<boolean>;
}