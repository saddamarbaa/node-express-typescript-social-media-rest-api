import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';

export interface IToken {
  emailVerificationExpiresToken?: string;
  emailVerificationToken?: string;
  resetPasswordExpires?: string;
  resetPasswordToken?: string;
  userId: Schema.Types.ObjectId;
}

export interface ITokenDocument extends Document, IToken {
  generatePasswordReset(): Promise<void>;
  generateEmailVerificationToken(): Promise<void>;
}

export const TokenSchema: Schema<ITokenDocument> = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
    emailVerificationToken: {
      type: String,
      required: false,
    },
    emailVerificationExpiresToken: {
      type: Date,
      required: false,
    },
  },

  { timestamps: true }
);

// Generate Password Reset
TokenSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; // expires in an hour
};

// Generate email verification token
TokenSchema.methods.generateEmailVerificationToken = function () {
  this.emailVerificationToken = crypto.randomBytes(32).toString('hex');
  this.emailVerificationExpiresToken = Date.now() + 3600000; // expires in an hour
};

TokenSchema.post('save', function () {
  console.log('Token is been Save ', this);
});

export default mongoose.models.Token || mongoose.model('Token', TokenSchema);
