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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fio = exports.getVersion = void 0;
const errors_1 = require("./errors");
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
            return { version };
        });
    }
    *_getVersion() {
        return yield* getVersion();
    }
}
exports.Fio = Fio;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Zpby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFpQkEscUNBQXlGO0FBQ3pGLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQTtBQW1CaEIsU0FBUyxvQkFBb0IsQ0FBcUIsRUFBSztJQUVuRCxPQUFPLENBQU8sR0FBRyxJQUFTLEVBQUUsRUFBRTtRQUMxQixJQUFJO1lBQ0EsT0FBTyxNQUFNLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFBO1NBQzNCO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDUixJQUNJLENBQUM7Z0JBQ1QsQ0FBQyxDQUFDLFVBQVU7Z0JBQ1osQ0FBQyxDQUFDLFVBQVUsS0FBSywwQkFBaUIsQ0FBQyxpQkFBaUIsRUFDOUM7Z0JBRUUsT0FBTyxNQUFNLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFBO2FBQzNCO1lBQ0QsTUFBTSxDQUFDLENBQUE7U0FDVjtJQUNMLENBQUMsQ0FBQSxDQUFBO0FBQ0wsQ0FBQztBQUdELFNBQWUsUUFBUSxDQUNuQixXQUEyQixFQUMzQixJQUFZOztRQUVaLElBQUksTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUMvQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUE7UUFDaEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7WUFDakIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQTtZQUN6QixNQUFNLEdBQUcsR0FBRyxLQUFLO2dCQUNiLENBQUMsQ0FBQyxNQUFNLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDeEMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ3RCLEtBQUssR0FBRyxLQUFLLENBQUE7WUFDYixNQUFNLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUNq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