"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    var _a;
    if (!res || typeof res.status !== "function") {
        throw new Error("Invalid Response object passed to sendResponse");
    }
    res.status((_a = data.statusCode) !== null && _a !== void 0 ? _a : 200).json({
        success: data.success,
        message: data.message,
        data: data.data
    });
};
exports.default = sendResponse;
