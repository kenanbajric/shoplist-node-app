"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// core imports
const express_1 = __importDefault(require("express"));
// const express = require('express');
// my imports
const shoplist_1 = require("../controllers/shoplist");
// Auth middleware
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const router = express_1.default.Router();
// shoplist routes
router.get('/', is_auth_1.default, shoplist_1.getUserLists);
router.post('/createshoplist', is_auth_1.default, shoplist_1.createShoplist);
router.post('/updateshoplist/:shoplistId', is_auth_1.default, shoplist_1.updateShoplist);
router.delete('/deleteshoplist/:shoplistId', is_auth_1.default, shoplist_1.deleteShoplist);
router.post('/report', is_auth_1.default, shoplist_1.getReport);
module.exports = router;
