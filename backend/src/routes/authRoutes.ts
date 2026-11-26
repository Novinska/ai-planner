import { Router, Request, Response } from "express";
import passport from "passport";
import { GoogleUser } from "../types/user.js";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/tasks",
    ],
    accessType: "offline",
    prompt: "consent",
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req: Request, res: Response) => {
    res.redirect("http://localhost:5173/dashboard");
  },
);

router.get("/current-user", (req: any, res: Response) => {
  if (req.user) {
    const u = req.user;

    const googleUser: GoogleUser = {
      id: u.id,
      displayName: u._googleProfile?.displayName || u.username,
      emails: u._googleProfile?.emails || [{ value: u.email, verified: true }],
      photos: u._googleProfile?.photos || [{ value: "" }],
      accessToken: u.accessToken,
      refreshToken: u.refreshToken,
    };

    return res.status(200).json(googleUser);
  }

  return res.status(401).json(null);
});

export default router;
