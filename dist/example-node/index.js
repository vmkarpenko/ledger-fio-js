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
const hw_transport_node_hid_1 = __importDefault(require("@ledgerhq/hw-transport-node-hid"));
const fio_1 = require("../src/fio");
const getVersion0 = (appFio) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getVersion");
    console.log(yield appFio.getVersion());
    console.log("-".repeat(40));
});
const getSerial0 = (appFio) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getSerial");
    console.log(yield appFio.getSerial());
    console.log("-".repeat(40));
});
const getExtendedPublicKey0 = (appFio) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getExtendedPublicKey");
    console.log(yield appFio.getExtendedPublicKey({
        path: [
            fio_1.HARDENED + 44,
            fio_1.HARDENED + 235,
            fio_1.HARDENED + 0,
        ]
    }));
    console.log("-".repeat(40));
});
function example() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Running FIO examples");
        const transport = yield hw_transport_node_hid_1.default.create(5000);
        console.log("Step1");
        const appFio = new fio_1.Fio(transport);
        console.log("Step2");
        yield getVersion0(appFio);
        console.log("Step3");
        console.log("Step2b");
        yield getSerial0(appFio);
        console.log("Step3b");
        console.log("Step2c");
        yield getExtendedPublicKey0(appFio);
        console.log("Step3c");
    });
}
example();
console.log("Step4");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9leGFtcGxlLW5vZGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0RkFBK0Q7QUFFL0Qsb0NBQTJDO0FBRTNDLE1BQU0sV0FBVyxHQUFHLENBQU8sTUFBVyxFQUFFLEVBQUU7SUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7SUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDOUIsQ0FBQyxDQUFBLENBQUE7QUFFRCxNQUFNLFVBQVUsR0FBRyxDQUFPLE1BQVcsRUFBRSxFQUFFO0lBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlCLENBQUMsQ0FBQSxDQUFBO0FBRUQsTUFBTSxxQkFBcUIsR0FBRyxDQUFPLE1BQVcsRUFBRSxFQUFFO0lBQ2xELE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUNwQyxPQUFPLENBQUMsR0FBRyxDQUNULE1BQU0sTUFBTSxDQUFDLG9CQUFvQixDQUFDO1FBQ2hDLElBQUksRUFBRTtZQUNKLGNBQVEsR0FBRyxFQUFFO1lBQ2IsY0FBUSxHQUFHLEdBQUc7WUFDZCxjQUFRLEdBQUcsQ0FBQztTQUNiO0tBQ0YsQ0FBQyxDQUNILENBQUM7SUFPRixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM5QixDQUFDLENBQUEsQ0FBQTtBQUdELFNBQWUsT0FBTzs7UUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sU0FBUyxHQUFHLE1BQU0sK0JBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXRELE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckIsTUFBTSxNQUFNLEdBQUcsSUFBSSxTQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyQixNQUFNLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXJCLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdEIsTUFBTSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV0QixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0scUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN4QixDQUFDO0NBQUE7QUFFRCxPQUFPLEVBQUUsQ0FBQztBQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMifQ==