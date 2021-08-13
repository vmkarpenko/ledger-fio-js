"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _a;
exports.__esModule = true;
exports.DeviceStatusError = exports.DeviceStatusCodes = void 0;
var errorBase_1 = require("./errorBase");
/**
 * Raw error codes returned by APDU protocol. Note that this is *not* an exhaustive list.
 * @category Errors
 */
exports.DeviceStatusCodes = {
    ERR_STILL_IN_CALL: 0x6e04,
    ERR_INVALID_DATA: 0x6e07,
    ERR_INVALID_BIP_PATH: 0x6e08,
    ERR_REJECTED_BY_USER: 0x6e09,
    ERR_REJECTED_BY_POLICY: 0x6e10,
    ERR_DEVICE_LOCKED: 0x6e11,
    ERR_UNSUPPORTED_ADDRESS_TYPE: 0x6e12,
    // Not thrown by ledger-app-cardano itself but other apps
    ERR_CLA_NOT_SUPPORTED: 0x6e00
};
// Human-readable version of errors reported by APDU protocol
var DeviceStatusMessages = (_a = {},
    _a[exports.DeviceStatusCodes.ERR_INVALID_DATA] = "Invalid data supplied to Ledger",
    _a[exports.DeviceStatusCodes.ERR_INVALID_BIP_PATH] = "Invalid derivation path supplied to Ledger",
    _a[exports.DeviceStatusCodes.ERR_REJECTED_BY_USER] = "Action rejected by user",
    _a[exports.DeviceStatusCodes.ERR_REJECTED_BY_POLICY] = "Action rejected by Ledger's security policy",
    _a[exports.DeviceStatusCodes.ERR_DEVICE_LOCKED] = "Device is locked",
    _a[exports.DeviceStatusCodes.ERR_CLA_NOT_SUPPORTED] = "Wrong Ledger app",
    _a[exports.DeviceStatusCodes.ERR_UNSUPPORTED_ADDRESS_TYPE] = "Unsupported address type",
    _a);
var GH_DEVICE_ERRORS_LINK = "https://github.com/vacuumlabs/ledger-fio/blob/master/ledgerjs-fio/src/errors/deviceStatusError.ts://github.com/cardano-foundation/ledger-app-cardano/blob/master/src/errors.h";
var getDeviceErrorDescription = function (statusCode) {
    var _a;
    var statusCodeHex = "0x" + statusCode.toString(16);
    var defaultMsg = "General error " + statusCodeHex + ". Please consult " + GH_DEVICE_ERRORS_LINK;
    return (_a = DeviceStatusMessages[statusCode]) !== null && _a !== void 0 ? _a : defaultMsg;
};
/**
 * Error wrapping APDU device error codes with human-readable message.
 * Use [[code]] for accessing underlying status code.
 * @category Errors
 */
var DeviceStatusError = /** @class */ (function (_super) {
    __extends(DeviceStatusError, _super);
    function DeviceStatusError(code) {
        var _this = _super.call(this, getDeviceErrorDescription(code)) || this;
        _this.code = code;
        return _this;
    }
    return DeviceStatusError;
}(errorBase_1.ErrorBase));
exports.DeviceStatusError = DeviceStatusError;
