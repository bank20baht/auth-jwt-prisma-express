import { Request, Response, NextFunction } from "express";
import db from "../utils/db";
import bcrypt from "bcrypt";
import { generateTokens } from "../utils/generateToken";

export const Register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const existingUser = await db.user.findUnique({
      where: {
        username: username,
      },
    });
    if (existingUser) {
      return res.status(409).send("User already exists. Please login");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      await db.user.create({
        data: {
          username: username,
          password: hashedPassword,
        },
      });

      return res.status(201).json({ message: "register complete" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

export const Login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }
    const user = await db.user.findUnique({
      where: {
        username: username,
      },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const tokens = generateTokens(user);

      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          refreshtoken: tokens.refreshToken,
        },
      });
      return res.status(200).json({
        accesstoken: tokens.accessToken,
        refreshtoken: tokens.refreshToken,
      });
    }
    return res.status(400).send("Invalid credentials");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};
