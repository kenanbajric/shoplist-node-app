import { Response, NextFunction } from "express";
import { newRequest } from "../models/new-request.js";
import User, { IUser } from '../models/user';
import Shoplist, { IShoplist } from '../models/shoplist';

export const getUserLists = async (
  req: newRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  try {
    let user = await User.findOne({ _id: userId }).populate("shoplist")! as IUser;
    res
      .status(200)
      .json({
        userId: user._id.toString(),
        name: user.name,
        shoplist: user.shoplist,
      });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

export const createShoplist = async (
  req: newRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  const shoplistName = req.body.shoplistName;
  const shoplistItems = req.body.shoplistItems;

  const shoplist = new Shoplist({
    name: shoplistName,
    items: shoplistItems,
    creator: userId,
  });
  try {
    await shoplist.save();
    let user = await User.findById(userId)! as IUser;
    user.shoplist.push(shoplist);
    await user.save();
    res.status(201).json({
      message: "Shoplist created successufully",
      shoplist: shoplist,
      creator: { _id: user._id, name: user.name },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

export const updateShoplist = async (
  req: newRequest,
  res: Response,
  next: NextFunction
) => {
  const shoplistId = req.params.shoplistId;
  const shoplistName = req.body.shoplistName;
  const shoplistItems = req.body.shoplistItems;
  try {
    let shoplist = await Shoplist.findOne({ _id: shoplistId }).populate(
      "creator"
    )! as IShoplist;
    if (shoplist.creator._id.toString() !== req.userId) {
      const error: any = new Error("Not authorized!");
      error.statusCode = 401;
      next(error);
      throw error;
    }
    shoplist.name = shoplistName;
    shoplist.items = shoplistItems;
    await shoplist.save();
    res.status(201).json({
      message: "Shoplist updated successufully",
      shoplist: shoplist,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

export const deleteShoplist = async (
  req: newRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const shoplistId = req.params.shoplistId;

  try {
    let shoplist = await Shoplist.findOne({ _id: shoplistId }).populate(
      "creator"
    )! as IShoplist;
    if (shoplist.creator._id.toString() !== req.userId) {
      const error: any = new Error("Not authorized!");
      error.statusCode = 403;
      next(error);
      throw error;
    }
    await Shoplist.findByIdAndRemove(shoplistId);
    let user = await User.findById(userId) as IUser;
    user.shoplist.pull(shoplistId);
    user.save();
    res.status(200).json({
      message: "Shoplist deleted successufully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

export const getReport = async (req: newRequest,
    res: Response,
    next: NextFunction) => {
  const userId = req.userId;
  const reportItems: any[] = [];
  const fromDate = new Date(req.body.fromDate);
  const toDate = new Date(req.body.toDate);
  try {
    let user = await User.findById(userId).populate("shoplist")! as IUser;
    user.shoplist.forEach((shoplist: IShoplist) => {
      if (shoplist.createdAt > fromDate && shoplist.createdAt < toDate) {
        shoplist.items.forEach((item) => {
          let includes = reportItems.includes(item.name);
          if (!includes) {
            reportItems.push(item.name);
            reportItems.push(item.quantity);
            return;
          } else {
            let qIndex = reportItems.indexOf(item.name) + 1;
            reportItems[qIndex] = reportItems[qIndex] + item.quantity;
          }
        });
      }
    });
    res.status(201).json({
      message: "Report Created",
      reportItems: reportItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};
