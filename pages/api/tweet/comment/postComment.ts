import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import fs from 'fs';
import formidable from 'formidable';
import path from 'path';
import { google, drive_v3 } from 'googleapis';
import { verify } from "jsonwebtoken";
import { getCookie } from "cookies-next";
// import Comment from "../../../../modelSql/comment";
import User from "../../../../modelNosql/user";
import { CommentData } from "../../../../dataTypes/typings";
import { Post } from "../../../../modelNosql/post";
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
    const { postId, commentMessage } = req.body

    const email: string | any = token?.email
    // find user from Sequelize DB
    // const user = await User.findOne({ where: { email } });

    // find user from Mongo DB
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // fetch old post
    const oldPost = await Post.findById(postId);

    const comments = oldPost.comments
    const newComment: CommentData = {
      comment: commentMessage,
      user: user.name,
      profImg: user.profileImg,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    comments.push(newComment);

    // Update the post with the updated comments array
    oldPost.comments = comments;

    // Save the updated post
    const newPost = await oldPost.save();
    // console.log(newPost)

    return res.status(200).json({ success: true, message: 'postComment success', newPost });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}