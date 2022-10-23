import { Request } from 'express';
import { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  role?: string;
  acceptTerms: boolean;
  familyName?: string;
  mobileNumber?: string;
  bio?: string;
  favoriteAnimal?: string;
  nationality?: string;
  companyName?: string;
  profileImage?: any;
  jobTitle?: string;
  status?: string;
  isVerified?: boolean;
  isDeleted?: boolean;
  address?: string;
  dateOfBirth?: string;
  createdAt?: string;
  updatedAt?: string;
  emailVerificationLinkToken?: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  gender?: string;
  joinedDate?: string;
  confirmationCode?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: string;
  userId?: Schema.Types.ObjectId;
}

export interface IRequestUser extends Request {
  user: IUser;
}

export interface IAuthRequest extends Request {
  headers: { authorization?: string; Authorization?: string };
  cookies: { authToken?: string };
  user?: IUser;
}

export interface IAuthRefreshTokenRequest extends Request {
  headers: { authorization?: string; Authorization?: string };
  cookies: { authToken?: string };
  accessToken?: string;
  refreshToken?: string;
}
