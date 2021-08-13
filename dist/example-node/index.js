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
const getVersion = (appFio) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getVersion");
    console.log(yield appFio.getVersion());
    console.log("-".repeat(40));
});
const getSerial = (appFio) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getSerial");
    console.log(yield appFio.getSerial());
    console.log("-".repeat(40));
});
const getExtendedPublicKey = (appFio) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getPublicKey");
    console.log(yield appFio.getPublicKey({ path: [
            fio_1.HARDENED + 44,
            fio_1.HARDENED + 235,
            fio_1.HARDENED + 0,
            0,
            0,
        ] }));
    console.log("-".repeat(40));
});
function example() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Running FIO examples");
        const transport = yield hw_transport_node_hid_1.default.create(5000);
        const appFio = new fio_1.Fio(transport);
        yield getVersion(appFio);
        yield getSerial(appFio);
        yield getExtendedPublicKey(appFio);
    });
}
example();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9leGFtcGxlLW5vZGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0RkFBK0Q7QUFFL0Qsb0NBQTJDO0FBRTNDLE1BQU0sVUFBVSxHQUFHLENBQU8sTUFBVyxFQUFFLEVBQUU7SUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7SUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDOUIsQ0FBQyxDQUFBLENBQUE7QUFFRCxNQUFNLFNBQVMsR0FBRyxDQUFPLE1BQVcsRUFBRSxFQUFFO0lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlCLENBQUMsQ0FBQSxDQUFBO0FBRUQsTUFBTSxvQkFBb0IsR0FBRyxDQUFPLE1BQVcsRUFBRSxFQUFFO0lBQ2pELE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FDVCxNQUFNLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBQyxJQUFJLEVBQUU7WUFDN0IsY0FBUSxHQUFHLEVBQUU7WUFDYixjQUFRLEdBQUcsR0FBRztZQUNkLGNBQVEsR0FBRyxDQUFDO1lBQ1osQ0FBQztZQUNELENBQUM7U0FDSixFQUFDLENBQUMsQ0FDSixDQUFDO0lBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDOUIsQ0FBQyxDQUFBLENBQUE7QUFHRCxTQUFlLE9BQU87O1FBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNwQyxNQUFNLFNBQVMsR0FBRyxNQUFNLCtCQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUVyRCxNQUFNLE1BQU0sR0FBRyxJQUFJLFNBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVsQyxNQUFNLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QixNQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QixNQUFNLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JDLENBQUM7Q0FBQTtBQUVELE9BQU8sRUFBRSxDQUFBIn0=