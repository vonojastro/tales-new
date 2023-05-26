import mongoose, { Schema, Document, Types } from 'mongoose';
import { CommentData, LikesData } from '../dataTypes/typings';


interface Post extends Document {
  userId: Types.ObjectId;
  text: string;
  blockPost: boolean;
  username: string;
  profileImg?: string;
  image?: string;
  comments?: CommentData[];
  likes?: LikesData[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    text: {
      type: String,
      // required: true,
    },
    blockPost: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    comments: [
      {
        comment: {
          type: String,
          required: true,
        },
        profImg: {
          type: String,
          required: false,
        },
        user: {
          type: String,
          required: true,
        },
        id: {
          type: Schema.Types.ObjectId,
          required: false,
        },
        createdAt: {
          type: Date,
          required: true,
        },
        updatedAt: {
          type: Date,
          required: true,
        },
      },
    ],
    likes: [
      {
        user: {
          type: String,
          required: true,
        },
        profImg: {
          type: String,
          required: false,
        },
        userEmail: {
          type: String,
          required: false,
        },
        userId: {
          type: Schema.Types.ObjectId,
          required: false,
          ref: 'User',
        },
        createdAt: {
          type: Date,
          required: true,
        },
        updatedAt: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: 'posts',
  },
);

export const Post = mongoose.models.Post || mongoose.model<Post>('Post', PostSchema);

export default Post;
