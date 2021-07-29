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
function example() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Running FIO examples");
        const transport = yield hw_transport_node_hid_1.default.create(5000);
        console.log("Step1");
        const appFio = new fio_1.Fio(transport);
        console.log("Step2");
        yield getVersion0(appFio);
        console.log("Step3");
    });
}
example();
console.log("Step4");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9leGFtcGxlLW5vZGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0RkFBK0Q7QUFFL0Qsb0NBQWlDO0FBRWpDLE1BQU0sV0FBVyxHQUFHLENBQU8sTUFBVyxFQUFFLEVBQUU7SUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7SUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDOUIsQ0FBQyxDQUFBLENBQUE7QUFJRCxTQUFlLE9BQU87O1FBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNwQyxNQUFNLFNBQVMsR0FBRyxNQUFNLCtCQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV0RCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JCLE1BQU0sTUFBTSxHQUFHLElBQUksU0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRWxDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckIsTUFBTSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QixDQUFDO0NBQUE7QUFFRCxPQUFPLEVBQUUsQ0FBQztBQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMifQ==