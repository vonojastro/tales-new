import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
// import Post from "../../../modelSql/post";
// import User from "../../../modelSql/user";
import fs from 'fs';
import formidable from 'formidable';
import path from 'path';
import { google, drive_v3 } from 'googleapis';
import { verify } from "jsonwebtoken";
import { getCookie } from "cookies-next";
import User from "../../../modelNosql/user";
import { Post } from "../../../modelNosql/post";
import { PostData } from "../../../dataTypes/typings";
import { getToken } from "next-auth/jwt";

interface CreatePost {
  text: string;
  blockPost?: boolean;
  username: string;
  profileImg?: string | null;
  image?: string | null;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

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
 
    const email: string | any = token?.email
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ success: false, message: 'Failed to parse form data' });
      }

      const filePhoto: any = files.postImage;

      // find user from Sequelize DB
      // const user = await User.findOne({ where: { email } });

      // find user from Mongo DB

      const user = await User.findOne({ email })

      if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const oauth2Client = new google.auth.OAuth2(
        process.env.GDRIVE_CLIENT_ID,
        process.env.GDRIVE_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );
      oauth2Client.setCredentials({
        refresh_token: process.env.GDRIVE_REFRESH_TOKEN,
      });
      const driveService = google.drive({
        version: "v3",
        auth: oauth2Client,
      });

      if (Boolean(files.postImage)) {
        const fileMetaData: drive_v3.Schema$File = {
          name: `post-img-${user.name}-${Date.now()}.${filePhoto.name}`,
          parents: [process.env.GOOGLE_API_FOLDER_ID!],
        };
        const path: string = filePhoto.filepath

        const media = {
          mimeType: filePhoto.type,
          body: fs.createReadStream(path),
        };

        const uploadPhotoRes = await driveService.files.create({
          requestBody: fileMetaData,
          media: media,
          fields: "id",
        });
        const imageValue = uploadPhotoRes.data.id ? `https://drive.google.com/uc?export=view&id=${uploadPhotoRes.data.id}` : ''
        const post: PostData = {
          userId: user.id,
          text: fields.postMessage as string,
          username: user.name,
          profileImg: user.profileImg,
          image: imageValue,
        };

        const newPost = await Post.create(post);
        return res.status(200).json({ success: true, newPost, message: 'Post saved to DB' });

      } else {
        const post: PostData = {
          userId: user.id,
          text: fields.postMessage as string,
          username: user.name,
          profileImg: user.profileImg,
          image: '',
        };

        const newPost = await Post.create(post);
        return res.status(200).json({ success: true, newPost, message: 'Post saved to DB' });
      }


    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}