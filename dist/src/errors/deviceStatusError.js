"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceStatusError = exports.DeviceStatusCodes = void 0;
const errorBase_1 = require("./errorBase");
exports.DeviceStatusCodes = {
    ERR_STILL_IN_CALL: 0x6e04,
    ERR_INVALID_DATA: 0x6e07,
    ERR_INVALID_BIP_PATH: 0x6e08,
    ERR_REJECTED_BY_USER: 0x6e09,
    ERR_REJECTED_BY_POLICY: 0x6e10,
    ERR_DEVICE_LOCKED: 0x6e11,
    ERR_UNSUPPORTED_ADDRESS_TYPE: 0x6e12,
    ERR_CLA_NOT_SUPPORTED: 0x6e00,
};
const DeviceStatusMessages = {
    [exports.DeviceStatusCodes.ERR_INVALID_DATA]: "Invalid data supplied to Ledger",
    [exports.DeviceStatusCodes.ERR_INVALID_BIP_PATH]: "Invalid derivation path supplied to Ledger",
    [exports.DeviceStatusCodes.ERR_REJECTED_BY_USER]: "Action rejected by user",
    [exports.DeviceStatusCodes.ERR_REJECTED_BY_POLICY]: "Action rejected by Ledger's security policy",
    [exports.DeviceStatusCodes.ERR_DEVICE_LOCKED]: "Device is locked",
    [exports.DeviceStatusCodes.ERR_CLA_NOT_SUPPORTED]: "Wrong Ledger app",
    [exports.DeviceStatusCodes.ERR_UNSUPPORTED_ADDRESS_TYPE]: "Unsupported address type",
};
const GH_DEVICE_ERRORS_LINK = "https://github.com/vacuumlabs/ledger-fio/blob/master/ledgerjs-fio/src/errors/deviceStatusError.ts";
const getDeviceErrorDescription = (statusCode) => {
    var _a;
    const statusCodeHex = `0x${statusCode.toString(16)}`;
    const defaultMsg = `General error ${statusCodeHex}. Please consult ${GH_DEVICE_ERRORS_LINK}`;
    return (_a = DeviceStatusMessages[statusCode]) !== null && _a !== void 0 ? _a : defaultMsg;
};
class DeviceStatusError extends errorBase_1.ErrorBase {
    constructor(code) {
        super(getDeviceErrorDescription(code));
        this.code = code;
    }
}
exports.DeviceStatusError = DeviceStatusError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2aWNlU3RhdHVzRXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXJyb3JzL2RldmljZVN0YXR1c0Vycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUF1QztBQU0xQixRQUFBLGlCQUFpQixHQUFHO0lBQzdCLGlCQUFpQixFQUFFLE1BQWU7SUFDbEMsZ0JBQWdCLEVBQUUsTUFBZTtJQUNqQyxvQkFBb0IsRUFBRSxNQUFlO0lBQ3JDLG9CQUFvQixFQUFFLE1BQWU7SUFDckMsc0JBQXNCLEVBQUUsTUFBZTtJQUN2QyxpQkFBaUIsRUFBRSxNQUFlO0lBQ2xDLDRCQUE0QixFQUFFLE1BQWU7SUFHN0MscUJBQXFCLEVBQUUsTUFBZTtDQUN6QyxDQUFBO0FBR0QsTUFBTSxvQkFBb0IsR0FBMkI7SUFDakQsQ0FBQyx5QkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLGlDQUFpQztJQUN2RSxDQUFDLHlCQUFpQixDQUFDLG9CQUFvQixDQUFDLEVBQ3BDLDRDQUE0QztJQUNoRCxDQUFDLHlCQUFpQixDQUFDLG9CQUFvQixDQUFDLEVBQUUseUJBQXlCO0lBQ25FLENBQUMseUJBQWlCLENBQUMsc0JBQXNCLENBQUMsRUFDdEMsNkNBQTZDO0lBQ2pELENBQUMseUJBQWlCLENBQUMsaUJBQWlCLENBQUMsRUFBRSxrQkFBa0I7SUFDekQsQ0FBQyx5QkFBaUIsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLGtCQUFrQjtJQUM3RCxDQUFDLHlCQUFpQixDQUFDLDRCQUE0QixDQUFDLEVBQUUsMEJBQTBCO0NBQy9FLENBQUE7QUFFRCxNQUFNLHFCQUFxQixHQUN2QixtR0FBbUcsQ0FBQTtBQUV2RyxNQUFNLHlCQUF5QixHQUFHLENBQUMsVUFBa0IsRUFBRSxFQUFFOztJQUNyRCxNQUFNLGFBQWEsR0FBRyxLQUFLLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQTtJQUNwRCxNQUFNLFVBQVUsR0FBRyxpQkFBaUIsYUFBYSxvQkFBb0IscUJBQXFCLEVBQUUsQ0FBQTtJQUU1RixPQUFPLE1BQUEsb0JBQW9CLENBQUMsVUFBVSxDQUFDLG1DQUFJLFVBQVUsQ0FBQTtBQUN6RCxDQUFDLENBQUE7QUFPRCxNQUFhLGlCQUFrQixTQUFRLHFCQUFTO0lBRzVDLFlBQW1CLElBQVk7UUFDM0IsS0FBSyxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7UUFDdEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7SUFDcEIsQ0FBQztDQUNKO0FBUEQsOENBT0MifQ==