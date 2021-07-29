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
exports.__esModule = true;
exports.DeviceVersionUnsupported = void 0;
var errorBase_1 = require("./errorBase");
/**
 * Thrown when user tried to call a method with incompatible Ledger App version
 * @category Errors
 */
var DeviceVersionUnsupported = /** @class */ (function (_super) {
    __extends(DeviceVersionUnsupported, _super);
    function DeviceVersionUnsupported(reason) {
        return _super.call(this, reason) || this;
    }
    return DeviceVersionUnsupported;
}(errorBase_1.ErrorBase));
exports.DeviceVersionUnsupported = DeviceVersionUnsupported;
