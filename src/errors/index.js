"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.InvalidDataReason = exports.DeviceStatusError = exports.DeviceStatusCodes = exports.DeviceVersionUnsupported = exports.InvalidData = exports.ErrorBase = void 0;
var errorBase_1 = require("./errorBase");
__createBinding(exports, errorBase_1, "ErrorBase");
var invalidData_1 = require("./invalidData");
__createBinding(exports, invalidData_1, "InvalidData");
var deviceUnsupported_1 = require("./deviceUnsupported");
__createBinding(exports, deviceUnsupported_1, "DeviceVersionUnsupported");
var deviceStatusError_1 = require("./deviceStatusError");
__createBinding(exports, deviceStatusError_1, "DeviceStatusCodes");
__createBinding(exports, deviceStatusError_1, "DeviceStatusError");
var invalidDataReason_1 = require("./invalidDataReason");
__createBinding(exports, invalidDataReason_1, "InvalidDataReason");
