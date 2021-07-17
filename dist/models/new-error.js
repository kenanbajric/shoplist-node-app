"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newError = void 0;
class newError {
    constructor(name, message, statusCode) {
        this.name = name;
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.newError = newError;
