
import NextAuth, { Account, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";

import {compare} from 'bcrypt';
import { NextApiRequest, NextApiResponse } from "next";
import sequelize from "../../../utils/dbMysql";
import jwt from 'jsonwebtoken';
import { serialize } from "cookie";
import User from "../../../modelNosql/user";
import connectDB from "../../../utils/dbMongo";
import { JWT } from "next-auth/jwt";
// import argon2 from 'argon2';

const options: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials as { email: string, password: string }

        // find user from Sequelize DB
        // const user: any = await User.findOne({ where: { email } });

        // find user from Mongo DB
        const user: any = await User.findOne({ email });
        if (!user) {
          throw new Error(`No user found for email: ${email}`);
          return null;
        }
        
        
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }
        console.log(isPasswordValid)

        return user;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    async signIn(params) {
      const { user, account, credentials } = params

      if (account?.provider === "google" || "facebook" || "github") {
        try {
          // await sequelize.authenticate();
          connectDB()

          // Sequelize Update Fuction
          // await User.update(
          //   { profileImg: user.image! },
          //   { where: { email: user.email! } }
          // );
          // const existingUser = await User.findOne({
          //   where: { email: user.email! },
          // });

          const existingUser = await User.findOne({ email: user.email! });

          // Mongooose Update Fuction
          await User.findOneAndUpdate(
            { email: user.email! },
            { $set: { profileImg: user.image! } }
          );

          // Sequelize UpdateFunction
          // await User.updateOne(
          //   { profileImg: user.image! },
          //   { where: { email: user.email! } }
          // );

          if (existingUser) {
            return true; // continue with sign in
          } else {
            const newUser = await User.create({
              email: user.email!,
              name: user.name!,
              profileImg: user.image!,
            });
            return true; // continue with sign in

          }
        } catch (err) {
          console.log('error', err);
          return false; // stop sign in
        }
      }
      return true;
    },
    async session({ session, user, token }: { session: any; token: any, user: any }) {

      session.accessToken = token.accessToken
      session.user.id = token.id

      return session
    },
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        // token.id = profile.id
      }
      return token
    }
  },
  pages: {
    signIn: "/",
  },


};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);