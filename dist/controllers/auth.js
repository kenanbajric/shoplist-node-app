"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.login = exports.signup = void 0;
// core imports
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// my imports
const user_1 = __importDefault(require("../models/user"));
const signup = async (req, res, next) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    console.log(email, name, password);
    try {
        const hashedPw = await bcryptjs_1.default.hash(password, 12);
        const user = new user_1.default({
            email: email,
            password: hashedPw,
            name: name,
        });
        const result = await user.save();
        res.status(201).json({ message: "User created!", userId: result._id });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            next(err);
        }
    }
};
exports.signup = signup;
const login = async (req, res, next) => {
    console.log('LOGIN ...');
    const email = req.body.email;
    const password = req.body.password;
    try {
        let user = await user_1.default.findOne({ email: email });
        if (!user) {
            const error = new Error("A user with this email could not be found.");
            error.statusCode = 401;
            next(error);
            throw error;
        }
        const isEqual = await bcryptjs_1.default.compare(password, user.password);
        if (!isEqual) {
            const error = new Error("Wrong password.");
            error.statusCode = 401;
            next(error);
            throw error;
        }
        const token = jsonwebtoken_1.default.sign({
            email: user.email,
            userId: user._id.toString(),
        }, "secret", { expiresIn: "1h" });
        res.status(200).json({ token: token, userId: user._id.toString() });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            next(err);
        }
    }
};
exports.login = login;
const updatePassword = async (req, res, next) => {
    const userId = req.userId;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    try {
        let user = await user_1.default.findOne({ _id: userId });
        if (!user) {
            const error = new Error("A user with this email could not be found.");
            error.statusCode = 403;
            next(error);
            throw error;
        }
        const isEqual = await bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isEqual) {
            const error = new Error("Wrong password.");
            error.statusCode = 403;
            next(error);
            throw error;
        }
        const hashedNewPw = await bcryptjs_1.default.hash(newPassword, 12);
        user.password = hashedNewPw;
        await user.save();
        res.status(201).json({ message: "Password updated!" });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            next(err);
        }
    }
};
exports.updatePassword = updatePassword;
