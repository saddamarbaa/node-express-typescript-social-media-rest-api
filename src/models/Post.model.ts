

import mongoose, { Document, Schema } from 'mongoose';



export interface IPost {
  title: string,
  content:string,
  postImage: string,
  author:string,
}


export interface IPostModel extends IPost, Document { }


const PostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    postImage:  { type: String, required: true },
    author:  { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);


export default mongoose.model<IPost>('Post', PostSchema);

 



