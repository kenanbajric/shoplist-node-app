import { Request } from "express";

export interface newRequest extends Request {
    userId: string;
}