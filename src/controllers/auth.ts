// core imports
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// my imports
import User from '../models/user';
import { Response, NextFunction } from "express";
import { newRequest } from "../models/new-request.js";

export const signup = async (req: newRequest, res: Response, next: NextFunction) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  console.log(email, name, password);
  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPw,
      name: name,
    });
    const result = await user.save();
    res.status(201).json({ message: "User created!", userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

export const login = async (req: newRequest, res: Response, next: NextFunction) => {
  console.log('LOGIN ...');
  const email = req.body.email;
  const password = req.body.password;
  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      const error: any = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      next(error);
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error: any = new Error("Wrong password.");
      error.statusCode = 401;
      next(error);
      throw error;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      "secret",
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token, userId: user._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

export const updatePassword = async (
  req: newRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  try {
    let user = await User.findOne({ _id: userId });
    if (!user) {
      const error: any = new Error("A user with this email could not be found.");
      error.statusCode = 403;
      next(error);
      throw error;
    }
    const isEqual = await bcrypt.compare(oldPassword, user.password);
    if (!isEqual) {
      const error: any = new Error("Wrong password.");
      error.statusCode = 403;
      next(error);
      throw error;
    }
    const hashedNewPw = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPw;
    await user.save();
    res.status(201).json({ message: "Password updated!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};
