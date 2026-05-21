import { Router, Request, Response } from "express";
import passport from "passport";

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

export default router;
