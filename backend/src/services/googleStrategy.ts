import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { prisma } from "../lib/prisma.js";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        const email = profile.emails?.[0].value || "";

        const user = await prisma.user.upsert({
          where: { googleId: profile.id },
          update: {
            accessToken,
            ...(refreshToken && { refreshToken }),
          },
          create: {
            googleId: profile.id,
            email: email,
            username: profile.displayName || "User",
            accessToken,
            refreshToken,
          },
        });

        return done(null, { ...user, _googleProfile: profile });
      } catch (error) {
        console.error("Помилка при збереженні юзера:", error);
        return done(error as Error);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});
