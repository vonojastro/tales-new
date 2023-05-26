import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
// import Post from "../../../modelSql/post";
import User from "../../../modelSql/user";
import { Post } from "../../../modelNosql/post";
import { CommentData, PostData } from "../../../dataTypes/typings";
import { getToken } from "next-auth/jwt";
// import Comment from "../../../modelSql/comment";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const secret = process.env.NEXTAUTH_SECRET
    const token = await getToken({ req, secret })
   
    // const user = await User.findOne({ where: { email } });

    if (token) {
      // const posts = await Post.findAll();
      // const comments = await Comment.findAll();

      const posts: PostData[] = await Post.find();

      return res.status(200).json({ success: true, posts });
    } else {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
      // } 
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}