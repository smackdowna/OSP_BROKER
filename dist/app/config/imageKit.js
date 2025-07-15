"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const imagekit_1 = __importDefault(require("imagekit"));
const index_1 = __importDefault(require("./index"));
const imageKt = new imagekit_1.default({
    urlEndpoint: index_1.default.imageKit_url_endpoint,
    publicKey: index_1.default.imageKit_public_key,
    privateKey: index_1.default.imageKit_private_key,
});
exports.default = imageKt;
