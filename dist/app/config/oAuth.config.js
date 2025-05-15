"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const index_1 = __importDefault(require("./index"));
const oauth2Client = new googleapis_1.google.auth.OAuth2(index_1.default.google_client_id, index_1.default.google_client_secret, index_1.default.google_redirect_uri);
exports.default = oauth2Client;
