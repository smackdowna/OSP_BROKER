"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.liveConventionController = void 0;
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const liveConvention_services_1 = require("./liveConvention.services");
const validation_1 = require("./validation");
// create signature
const createSignature = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const propValidations = {
        role: (0, validation_1.inNumberArray)([0, 1]),
        expirationSeconds: (0, validation_1.isBetween)(1800, 172800),
        videoWebRtcMode: (0, validation_1.inNumberArray)([0, 1])
    };
    const schemaValidations = [(0, validation_1.isRequiredAllOrNone)(['meetingNumber', 'role'])];
    const coerceRequestBody = (body) => (Object.assign(Object.assign({}, body), ['meetingNumber', 'role', 'expirationSeconds', 'videoWebRtcMode'].reduce((acc, cur) => (Object.assign(Object.assign({}, acc), { [cur]: typeof body[cur] === 'string' ? parseInt(body[cur], 10) : body[cur] })), {})));
    const requestBody = coerceRequestBody(req.body);
    const validationErrors = (0, validation_1.validateRequest)(requestBody, propValidations, schemaValidations);
    if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
    }
    const { meetingNumber, role, expirationSeconds, videoWebRtcMode } = requestBody;
    const signature = yield liveConvention_services_1.liveConventionServices.createSignature({ meetingNumber, role, expirationSeconds, videoWebRtcMode });
    if (!signature) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "Failed to create signature",
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Signature created successfully",
        data: signature,
    });
}));
// notify live convention to business page followers
const notifyLiveConvention = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessId } = req.params;
    yield liveConvention_services_1.liveConventionServices.notifyLiveConvention(businessId, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Live convention notification sent successfully",
    });
}));
exports.liveConventionController = {
    createSignature,
    notifyLiveConvention
};
