import express from "express";
import zod from "zod";
import { User } from "../db.js";
import jwt from "jsonwebtoken";
import { JWTSECRET } from "../constant.js";
import authMiddleware from "../middleware.js";

const router = express.Router();

const signupType = zod.object({
  name: zod.string(),
  email: zod.string().email(),
  password: zod.string(),
});

const signinType = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  const { success } = signupType.safeParse(req.body);
  if (!success) {
    return res.json({
      msg: "Incorrect input Type",
    });
  }
  const existingUser = await User.findOne({
    email: req.body.email,
  });
  console.log(existingUser);
  if (existingUser) {
    return res.json({
      msg: "User already exist",
    });
  }
  try {
    const user = await User.create({ ...req.body });
    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWTSECRET
    );
    res.status(200).json({
      user: user,
      token: token,
    });
  } catch (e) {
    console.log("Error while creating user");
  }
});

router.post("/signin", authMiddleware, async (req, res) => {
  const { success } = signinType.safeParse(req.body);

  if (!success) {
    return res.json({
      msg: "Incorrect input type",
    });
  }

  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWTSECRET
    );
    return res.status(200).json({
      user,
      token,
    });
  } catch (e) {
    console.log("Error while signing ");
  }
});

export default router;
