"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// core imports
const express_1 = __importDefault(require("express"));
// my imports
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const auth_1 = require("../controllers/auth");
const router = express_1.default.Router();
router.post('/signup', auth_1.signup);
router.post('/login', auth_1.login);
router.post('/updatePassword', is_auth_1.default, auth_1.updatePassword);
module.exports = router;
