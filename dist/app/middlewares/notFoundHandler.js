"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../errors/appError"));
const http_status_1 = __importDefault(require("http-status"));
const notFoundHandler = (req, res, next) => {
    const err = new appError_1.default(http_status_1.default.NOT_FOUND, 'Route Not Found');
    next(err);
};
exports.default = notFoundHandler;
