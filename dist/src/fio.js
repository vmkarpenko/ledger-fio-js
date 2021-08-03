"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fio = exports.getVersion = void 0;
const errors_1 = require("./errors");
const invalidDataReason_1 = require("./errors/invalidDataReason");
const getExtendedPublicKeys_1 = require("./interactions/getExtendedPublicKeys");
const getSerial_1 = require("./interactions/getSerial");
const parse_1 = require("./utils/parse");
__exportStar(require("./errors"), exports);
__exportStar(require("./types/public"), exports);
const CLA = 0xd7;
function wrapRetryStillInCall(fn) {
    return (...args) => __awaiter(this, void 0, void 0, function* () {
        try {
            return yield fn(...args);
        }
        catch (e) {
            if (e &&
                e.statusCode &&
                e.statusCode === errors_1.DeviceStatusCodes.ERR_STILL_IN_CALL) {
                return yield fn(...args);
            }
            throw e;
        }
    });
}
function interact(interaction, send) {
    return __awaiter(this, void 0, void 0, function* () {
        let cursor = interaction.next();
        let first = true;
        while (!cursor.done) {
            const apdu = cursor.value;
            console.log("11111");
            console.log(apdu);
            const res = first
                ? yield wrapRetryStillInCall(send)(apdu)
                : yield send(apdu);
            first = false;
            cursor = interaction.next(res);
        }
        return cursor.value;
    });
}
function wrapConvertDeviceStatusError(fn) {
    return (...args) => __awaiter(this, void 0, void 0, function* () {
        try {
            return yield fn(...args);
        }
        catch (e) {
            if (e && e.statusCode) {
                throw new errors_1.DeviceStatusError(e.statusCode);
            }
            throw e;
        }
    });
}
function* getVersion() {
    const P1_UNUSED = 0x00;
    const P2_UNUSED = 0x00;
    const response = yield {
        ins: 0,
        p1: P1_UNUSED,
        p2: P2_UNUSED,
        data: Buffer.alloc(0),
        expectedResponseLength: 4,
    };
    const [major, minor, patch, flags_value] = response;
    const FLAG_IS_DEBUG = 1;
    const flags = {
        isDebug: (flags_value & FLAG_IS_DEBUG) === FLAG_IS_DEBUG,
    };
    return { major, minor, patch, flags };
}
exports.getVersion = getVersion;
class Fio {
    constructor(transport, scrambleKey = "FIO") {
        this.transport = transport;
        const methods = [
            "getVersion",
            "getSerial",
            "getExtendedPublicKeys",
        ];
        this.transport.decorateAppAPIMethods(this, methods, scrambleKey);
        this._send = (params) => __awaiter(this, void 0, void 0, function* () {
            let response = yield wrapConvertDeviceStatusError(this.transport.send)(CLA, params.ins, params.p1, params.p2, params.data);
            return response;
        });
    }
    getVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            const version = yield interact(this._getVersion(), this._send);
            return { version, compatibility: 0 };
        });
    }
    *_getVersion() {
        return yield* getVersion();
    }
    getSerial() {
        return __awaiter(this, void 0, void 0, function* () {
            return interact(this._getSerial(), this._send);
        });
    }
    *_getSerial() {
        const version = yield* getVersion();
        return yield* getSerial_1.getSerial(version);
    }
    getExtendedPublicKeys({ paths }) {
        return __awaiter(this, void 0, void 0, function* () {
            parse_1.validate(parse_1.isArray(paths), invalidDataReason_1.InvalidDataReason.GET_EXT_PUB_KEY_PATHS_NOT_ARRAY);
            const parsed = paths.map((path) => parse_1.parseBIP32Path(path, invalidDataReason_1.InvalidDataReason.INVALID_PATH));
            console.log("NUNUNUNU\n");
            console.log(parsed);
            return interact(this._getExtendedPublicKeys(parsed), this._send);
        });
    }
    *_getExtendedPublicKeys(paths) {
        const version = yield* getVersion();
        return yield* getExtendedPublicKeys_1.getExtendedPublicKeys(version, paths);
    }
    getExtendedPublicKey({ path }) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getExtendedPublicKeys({ paths: [path] }))[0];
        });
    }
}
exports.Fio = Fio;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Zpby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLHFDQUE4RDtBQUM5RCxrRUFBOEQ7QUFJOUQsZ0ZBQTRFO0FBQzVFLHdEQUFvRDtBQUNwRCx5Q0FBaUU7QUFFakUsMkNBQXdCO0FBQ3hCLGlEQUE4QjtBQUU5QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUE7QUFRaEIsU0FBUyxvQkFBb0IsQ0FBcUIsRUFBSztJQUVuRCxPQUFPLENBQU8sR0FBRyxJQUFTLEVBQUUsRUFBRTtRQUMxQixJQUFJO1lBQ0EsT0FBTyxNQUFNLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFBO1NBQzNCO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDUixJQUNJLENBQUM7Z0JBQ1QsQ0FBQyxDQUFDLFVBQVU7Z0JBQ1osQ0FBQyxDQUFDLFVBQVUsS0FBSywwQkFBaUIsQ0FBQyxpQkFBaUIsRUFDOUM7Z0JBRUUsT0FBTyxNQUFNLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFBO2FBQzNCO1lBQ0QsTUFBTSxDQUFDLENBQUE7U0FDVjtJQUNMLENBQUMsQ0FBQSxDQUFBO0FBQ0wsQ0FBQztBQUdELFNBQWUsUUFBUSxDQUNuQixXQUEyQixFQUMzQixJQUFZOztRQUVaLElBQUksTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUMvQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUE7UUFDaEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7WUFDakIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQTtZQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDakIsTUFBTSxHQUFHLEdBQUcsS0FBSztnQkFDYixDQUFDLENBQUMs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