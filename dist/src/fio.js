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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fio = void 0;
const errors_1 = require("./errors");
const invalidDataReason_1 = require("./errors/invalidDataReason");
const getVersion_1 = require("./interactions/getVersion");
const getSerial_1 = require("./interactions/getSerial");
const getPublicKey_1 = require("./interactions/getPublicKey");
const signTransaction_1 = require("./interactions/signTransaction");
const runTests_1 = require("./interactions/runTests");
const parse_1 = require("./utils/parse");
const utils_1 = __importDefault(require("./utils"));
const assert_1 = require("./utils/assert");
__exportStar(require("./errors"), exports);
__exportStar(require("./types/public"), exports);
const CLA = 0xd7;
function wrapConvertDeviceStatusError(fn) {
    return (...args) => __awaiter(this, void 0, void 0, function* () {
        try {
            return yield fn(...args);
        }
        catch (e) {
            console.log("CHYBA!!!");
            console.log(e.statusCode);
            console.log(e);
            if (e && e.statusCode) {
                console.log("We throw DeviceStatusError");
                throw new errors_1.DeviceStatusError(e.statusCode);
            }
            throw e;
        }
    });
}
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
            const res = first
                ? yield wrapRetryStillInCall(send)(apdu)
                : yield send(apdu);
            first = false;
            cursor = interaction.next(res);
        }
        return cursor.value;
    });
}
class Fio {
    constructor(transport, scrambleKey = "FIO") {
        this.transport = transport;
        const methods = [
            "getVersion",
            "getSerial",
            "getPublicKey",
        ];
        this.transport.decorateAppAPIMethods(this, methods, scrambleKey);
        this._send = (params) => __awaiter(this, void 0, void 0, function* () {
            let response = yield wrapConvertDeviceStatusError(this.transport.send)(CLA, params.ins, params.p1, params.p2, params.data);
            console.log(response);
            response = utils_1.default.stripRetcodeFromResponse(response);
            if (params.expectedResponseLength != null) {
                assert_1.assert(response.length === params.expectedResponseLength, `unexpected response length: ${response.length} instead of ${params.expectedResponseLength}`);
            }
            return response;
        });
    }
    getVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            const version = yield interact(this._getVersion(), this._send);
            return { version, compatibility: getVersion_1.getCompatibility(version) };
        });
    }
    *_getVersion() {
        return yield* getVersion_1.getVersion();
    }
    getSerial() {
        return __awaiter(this, void 0, void 0, function* () {
            return interact(this._getSerial(), this._send);
        });
    }
    *_getSerial() {
        const version = yield* getVersion_1.getVersion();
        return yield* getSerial_1.getSerial(version);
    }
    getPublicKey({ path }) {
        return __awaiter(this, void 0, void 0, function* () {
            parse_1.validate(parse_1.isValidPath(path), invalidDataReason_1.InvalidDataReason.GET_EXT_PUB_KEY_PATHS_NOT_ARRAY);
            const parsed = parse_1.parseBIP32Path(path, invalidDataReason_1.InvalidDataReason.INVALID_PATH);
            return interact(this._getPublicKey(parsed), this._send);
        });
    }
    *_getPublicKey(path) {
        const version = yield* getVersion_1.getVersion();
        return yield* getPublicKey_1.getPublicKey(version, path);
    }
    signTransaction({ path, tx }) {
        return __awaiter(this, void 0, void 0, function* () {
            parse_1.validate(parse_1.isValidPath(path), invalidDataReason_1.InvalidDataReason.GET_EXT_PUB_KEY_PATHS_NOT_ARRAY);
            const parsedPath = parse_1.parseBIP32Path(path, invalidDataReason_1.InvalidDataReason.INVALID_PATH);
            return interact(this._signTransaction(parsedPath, tx), this._send);
        });
    }
    *_signTransaction(parsedPath, tx) {
        const version = yield* getVersion_1.getVersion();
        return yield* signTransaction_1.signTransaction(version, parsedPath, tx);
    }
    runTests() {
        return __awaiter(this, void 0, void 0, function* () {
            return interact(this._runTests(), this._send);
        });
    }
    *_runTests() {
        const version = yield* getVersion_1.getVersion();
        return yield* runTests_1.runTests(version);
    }
}
exports.Fio = Fio;
exports.default = Fio;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Zpby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLHFDQUE4RDtBQUM5RCxrRUFBOEQ7QUFJOUQsMERBQXdFO0FBQ3hFLHdEQUFvRDtBQUNwRCw4REFBMEQ7QUFDMUQsb0VBQWdFO0FBQ2hFLHNEQUFrRDtBQUNsRCx5Q0FBcUU7QUFDckUsb0RBQTJCO0FBQzNCLDJDQUF1QztBQUV2QywyQ0FBd0I7QUFDeEIsaURBQThCO0FBRTlCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQTtBQUVoQixTQUFTLDRCQUE0QixDQUFxQixFQUFLO0lBRTNELE9BQU8sQ0FBTyxHQUFHLElBQUksRUFBRSxFQUFFO1FBQ3JCLElBQUk7WUFDQSxPQUFPLE1BQU0sRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUE7U0FDM0I7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUU7Z0JBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQTtnQkFDekMsTUFBTSxJQUFJLDBCQUFpQixDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQTthQUM1QztZQUNELE1BQU0sQ0FBQyxDQUFBO1NBQ1Y7SUFDTCxDQUFDLENBQUEsQ0FBQTtBQUNMLENBQUM7QUFxQkQsU0FBUyxvQkFBb0IsQ0FBcUIsRUFBSztJQUVuRCxPQUFPLENBQU8sR0FBRyxJQUFTLEVBQUUsRUFBRTtRQUMxQixJQUFJO1lBQ0EsT0FBTyxNQUFNLEVBQUUsQ0FBQyxHQUFHLElBQUks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