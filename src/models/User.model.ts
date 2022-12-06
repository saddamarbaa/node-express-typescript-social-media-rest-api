import bcrypt from 'bcrypt';
import { Schema, Document, model, models } from 'mongoose';
import jwt from 'jsonwebtoken';
import validator from 'validator';

import { environmentConfig } from '@src/configs/custom-environment-variables.config';
import { IUser } from '@src/interfaces';

export interface IUserDocument extends Document, IUser {
  // document level operations
  // eslint-disable-next-line no-unused-vars
  comparePassword(password: string): Promise<boolean>;
  createJWT(): Promise<void>;
}

const UserSchema: Schema<IUserDocument> = new Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, 'Please provide name'],
      minLength: [3, "Name can't be smaller than 3 characters"],
      maxLength: [15, "Name can't be greater than 15 characters"],
    },
    firstName: {
      type: String,
      trim: true,
      lowercase: true,
      required: [false, 'Please provide first name'],
      minLength: [3, "Name can't be smaller than 3 characters"],
      maxLength: [15, "Name can't be greater than 15 characters"],
    },
    lastName: {
      type: String,
      required: [false, 'Please provide last name'],
      minLength: [3, "Name can't be smaller than 3 characters"],
      maxLength: [15, "Name can't be greater than 15 characters"],
      trim: true,
      lowercase: true,
    },
    familyName: {
      type: String,
      required: false,
      trim: true,
      minlength: [3, "Name can't be smaller than 3 characters"],
      maxLength: [30, "Name can't be greater than 30 characters"],
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
      maxLength: [128, "Email can't be greater than 128 characters"],
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: [6, 'Password must be more than 6 characters'],
      trim: true,
    },
    confirmPassword: {
      type: String,
      required: [true, 'Please provide confirmed Password'],
      minlength: [6, 'Password must be more than 6 characters'],
      trim: true,
    },
    companyName: {
      type: String,
      required: false,
      trim: true,
      minlength: [3, "Company Name can't be smaller than 3 characters"],
      maxLength: [30, "Company Name can't be greater than 30 characters"],
      lowercase: true,
    },
    dateOfBirth: {
      type: String,
      maxLength: 15,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: false,
      maxLength: [5, "mobileNumber can't be greater than 15 characters"],
      // match: [/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Please provide a valid number'],
      trim: true,
    },
    gender: { type: String, trim: true, lowercase: true },
    joinedDate: {
      type: Date,
      default: new Date(),
      trim: true,
    },
    profileImage: {
      type: String,
      required: false,
      default: '/static/uploads/users/temp.png',
      lowercase: true,
    },
    role: {
      type: String,
      trim: true,
      lowercase: true,
      enum: ['user', 'guide', 'admin'],
      default: 'user',
    },
    favoriteAnimal: {
      type: String,
      required: false,
      trim: true,
      minlength: [3, "Favorite Animal can't be smaller than 3 characters"],
      maxLength: [35, "Favorite Animal can't be greater than 15 characters"],
      lowercase: true,
    },
    nationality: {
      type: String,
      trim: true,
      required: false,
      lowercase: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'active'],
      default: 'pending',
      required: false,
      trim: true,
      lowercase: true,
    },
    bio: {
      type: String,
      required: false,
      trim: true,
      minlength: [10, "Bio can't be smaller than 10 characters"],
      maxLength: [300, "Bio can't be greater than 300 characters"],
      lowercase: true,
    },
    jobTitle: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      minlength: [2, "Job Title can't be smaller than 3 characters"],
      maxLength: [30, "Job Title can't be greater than 15 characters"],
    },
    address: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    acceptTerms: { type: Boolean, required: false, default: false },
    confirmationCode: { type: String, require: false, index: true, unique: true, sparse: true },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

UserSchema.pre('save', async function (next) {
  console.log('Middleware called before saving the user is', this);
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);
    user.confirmPassword = await bcrypt.hash(user.password, salt);
  }
  next();
});

UserSchema.post('save', function () {
  console.log('Middleware called after saving the user is (User is been Save )', this);
});

UserSchema.methods.createJWT = function () {
  const payload = {
    userId: this._id,
    email: this.email,
    name: this.firstName,
    dateOfBirth: this.dateOfBirth,
    gender: this.gender,
    role: this.role,
  };

  return jwt.sign(payload, environmentConfig.TOKEN_SECRET as string, {
    expiresIn: environmentConfig.JWT_EXPIRE_TIME,
  });
};

export default models.User || model<IUserDocument>('User', UserSchema);
