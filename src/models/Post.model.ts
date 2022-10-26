import mongoose, { Schema } from 'mongoose';

import { Post } from '@src/interfaces';

export const PostSchema: Schema<Post> = new Schema(
  {
    title: {
      type: String,
      trim: true,
      // lowercase: true,
      required: [true, 'Please provide title'],
    },
    content: {
      type: String,
      trim: true,
      // lowercase: true,
      required: [true, 'Please provide post description'],
    },
    postImage: { type: String, required: true },
    author: {
      // every post shuold blong to user
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // add relationship
      required: [true, 'author is required'],
    },
    category: {
      type: String,
      lowercase: true,
      enum: ['coding', 'sports', 'nodejs', 'all', 'typescript'],
      default: 'all',
      trim: true,
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.Post || mongoose.model<Post>('Post', PostSchema);
