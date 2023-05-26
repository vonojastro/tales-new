import { NextApiRequest, NextApiResponse } from "next";
import { getCsrfToken, getProviders, getSession } from "next-auth/react";

import fs from 'fs';
import formidable from 'formidable';
import path from 'path';
import { google, drive_v3 } from 'googleapis';
import { verify } from "jsonwebtoken";
import { getCookie } from "cookies-next";
// import Comment from "../../../../modelSql/comment";
import User from "../../../modelNosql/user";
import { CommentData, LikesData } from "../../../dataTypes/typings";
import { Post } from "../../../modelNosql/post";
import { getToken } from "next-auth/jwt";


interface CreatePost {
  text: string;
  blockPost?: boolean;
  username: string;
  profileImg?: string | null;
  image?: string | null;
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  interface DecodedToken {
    user: {
      email: string;
      name: string;
      image: string;
    }
  }
  const secret = process.env.NEXTAUTH_SECRET

  try {
    const token = await getToken({ req, secret })
 
    const likePost = req.body

    const email: string | any = token?.email
    // find user from Sequelize DB
    // const user = await User.findOne({ where: { email } });

    // find user from Mongo DB
    const user = await User.findOne({ email });
    // console.log(likePost.postId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }


    const dislike = await Post.findOne({ _id: likePost.postId, likes: { $elemMatch: { userId: user.id } } });
    if (dislike) {
      const updatedLikes = dislike.likes.filter((like: LikesData) => like.userId.toString() !== user.id.toString());
      dislike.likes = updatedLikes;
      const updatedPost = await dislike.save();
      // console.log(updatedPost)
      return res.status(200).json({ success: true, message: 'Post disliked successfully', like: false });

    } else if (likePost.postId && !dislike) {
      const oldPost = await Post.findOne({ _id: likePost.postId });

      // console.log(oldPost)
      if (!oldPost) {
        return res.status(404).json({ success: false, message: 'Post not found' });
      }

      const likes = oldPost.likes || [];
      const newLike: LikesData = {
        profImg: user.profileImg,
        user: user.name,
        userEmail: user.email,
        userId: user._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      likes.push(newLike);

      oldPost.likes = likes;
      const newPost = await oldPost.save();
      // console.log(newPost)

      return res.status(200).json({ success: true, message: 'postComment success', like: true });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}