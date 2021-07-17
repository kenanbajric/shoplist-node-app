"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReport = exports.deleteShoplist = exports.updateShoplist = exports.createShoplist = exports.getUserLists = void 0;
const user_1 = __importDefault(require("../models/user"));
const shoplist_1 = __importDefault(require("../models/shoplist"));
const getUserLists = async (req, res, next) => {
    const userId = req.userId;
    try {
        let user = await user_1.default.findOne({ _id: userId }).populate("shoplist");
        res
            .status(200)
            .json({
            userId: user._id.toString(),
            name: user.name,
            shoplist: user.shoplist,
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            next(err);
        }
    }
};
exports.getUserLists = getUserLists;
const createShoplist = async (req, res, next) => {
    const userId = req.userId;
    const shoplistName = req.body.shoplistName;
    const shoplistItems = req.body.shoplistItems;
    const shoplist = new shoplist_1.default({
        name: shoplistName,
        items: shoplistItems,
        creator: userId,
    });
    try {
        await shoplist.save();
        let user = await user_1.default.findById(userId);
        user.shoplist.push(shoplist);
        await user.save();
        res.status(201).json({
            message: "Shoplist created successufully",
            shoplist: shoplist,
            creator: { _id: user._id, name: user.name },
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            next(err);
        }
    }
};
exports.createShoplist = createShoplist;
const updateShoplist = async (req, res, next) => {
    const shoplistId = req.params.shoplistId;
    const shoplistName = req.body.shoplistName;
    const shoplistItems = req.body.shoplistItems;
    try {
        let shoplist = await shoplist_1.default.findOne({ _id: shoplistId }).populate("creator");
        if (shoplist.creator._id.toString() !== req.userId) {
            const error = new Error("Not authorized!");
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
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            next(err);
        }
    }
};
exports.updateShoplist = updateShoplist;
const deleteShoplist = async (req, res, next) => {
    const userId = req.userId;
    const shoplistId = req.params.shoplistId;
    try {
        let shoplist = await shoplist_1.default.findOne({ _id: shoplistId }).populate("creator");
        if (shoplist.creator._id.toString() !== req.userId) {
            const error = new Error("Not authorized!");
            error.statusCode = 403;
            next(error);
            throw error;
        }
        await shoplist_1.default.findByIdAndRemove(shoplistId);
        let user = await user_1.default.findById(userId);
        user.shoplist.pull(shoplistId);
        user.save();
        res.status(200).json({
            message: "Shoplist deleted successufully",
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            next(err);
        }
    }
};
exports.deleteShoplist = deleteShoplist;
const getReport = async (req, res, next) => {
    const userId = req.userId;
    const reportItems = [];
    const fromDate = new Date(req.body.fromDate);
    const toDate = new Date(req.body.toDate);
    try {
        let user = await user_1.default.findById(userId).populate("shoplist");
        user.shoplist.forEach((shoplist) => {
            if (shoplist.createdAt > fromDate && shoplist.createdAt < toDate) {
                shoplist.items.forEach((item) => {
                    let includes = reportItems.includes(item.name);
                    if (!includes) {
                        reportItems.push(item.name);
                        reportItems.push(item.quantity);
                        return;
                    }
                    else {
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
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            next(err);
        }
    }
};
exports.getReport = getReport;
