import { HexString, Uint8_t } from "types/internal"
import type {SignedTransactionData} from "../../types/public"

export const enum COMMAND {
    NONE = 0x00,
    INIT = 0x01,
    APPEND_CONST_DATA = 0x02,
    SHOW_MESSAGE = 0x03,
    APPEND_DATA = 0x04,
    START_COUNTED_SECTION = 0x05,
    END_COUNTED_SECTION = 0x06,
    STORE_VALUE = 0x07,
    FINISH= 0x10,
};

export const enum VALUE_FORMAT {
    VALUE_FORMAT_BUFFER_SHOW_AS_HEX = 0x01,
    VALUE_FORMAT_ASCII_STRING = 0x02,
    VALUE_FORMAT_NAME = 0x03,

    VALUE_FORMAT_FIO_AMOUNT = 0x10,
    VALUE_FORMAT_UINT64 = 0x14,
    VALUE_FORMAT_VARUINT32 = 0x17,
}

export const enum VALUE_VALIDATION {
    VALUE_VALIDATION_NONE = 1,
    VALUE_VALIDATION_INBUFFER_LENGTH = 2,
    VALUE_VALIDATION_NUMBER = 3,
}

export const enum VALUE_POLICY {
    VALUE_SHOW_ON_DEVICE = 5,
    VALUE_DO_NOT_SHOW_ON_DEVICE = 2,
}

export const enum VALUE_STORAGE_COMPARE {
    DO_NOT_COMPARE = 0x00,
    COMPARE_REGISTER1 = 0x10,
    COMPARE_REGISTER2 = 0x20,
    COMPARE_REGISTER3 = 0x30,
}

export type Command = {
    command: COMMAND,
    p2: Uint8_t,
    constData: HexString,
    varData: Buffer,
    expectedResponseLength: number,
    dataAction: (b: Buffer, s: SignedTransactionData) => SignedTransactionData, 
}

export const defaultCommand: Command = {
    command: COMMAND.NONE,
    p2: 0 as Uint8_t,
    constData: "" as HexString,
    varData: Buffer.from(""),
    expectedResponseLength: 0,
    dataAction: (b, s) => s,
}

export function constDataAppendData(format: VALUE_FORMAT, validation: VALUE_VALIDATION, arg1: bigint, arg2: bigint,
                                    policy: VALUE_POLICY, storage: VALUE_STORAGE_COMPARE, key: string): HexString {
    const buf = Buffer.allocUnsafe(20+ key.length);
    buf.writeUInt8(format, 0);
    buf.writeUInt8(validation, 1);
    buf.writeBigUInt64LE(arg1, 2);
    buf.writeBigUInt64LE(arg2, 10);
    buf.writeUInt8(policy | storage, 18);
    buf.writeUInt8(key.length, 19);
    buf.write(key, 20);
    return buf.toString("hex") as HexString;
}

export function constDataShowMessage(key: string, value: string) {
    const buf = Buffer.allocUnsafe(2+key.length+value.length);
    buf.writeUInt8(key.length, 0);
    buf.write(key, 1);
    buf.writeUInt8(value.length, 1+key.length);
    buf.write(value, 2+key.length);
    return buf.toString("hex") as HexString;
}

export function constDataStartCountedSection(format: VALUE_FORMAT, validation: VALUE_VALIDATION, arg1: bigint, arg2: bigint): HexString {
    const buf = Buffer.allocUnsafe(18);
    buf.writeUInt8(format, 0);
    buf.writeUInt8(validation, 1);
    buf.writeBigUInt64LE(arg1, 2);
    buf.writeBigUInt64LE(arg2, 10);
    return buf.toString("hex") as HexString;
}

export function getCommandVarLength(commands: Array<Command>) {
    let len: number = 0;
    for(const c of commands) {
        len += c.varData.length;
    }
    return len;
}