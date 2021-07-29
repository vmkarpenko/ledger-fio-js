/// <reference types="node" />
/// <reference types="ledgerhq__hw-transport" />
import type Transport from "@ledgerhq/hw-transport";
export declare const enum INS {
    GET_VERSION = 0,
    GET_VERSION2 = 1
}
export declare type SendParams = {
    ins: number;
    p1: number;
    p2: number;
    data: Buffer;
    expectedResponseLength?: number;
};
export declare type Interaction<RetValue> = Generator<SendParams, RetValue, Buffer>;
export declare type SendFn = (params: SendParams) => Promise<Buffer>;
export declare type Flags = {
    isDebug: boolean;
};
export declare type Version = {
    major: number;
    minor: number;
    patch: number;
    flags: Flags;
};
export declare type GetVersionResponse = {
    version: Version;
};
export declare function getVersion(): Interaction<Version>;
export declare class Fio {
    transport: Transport<string>;
    _send: SendFn;
    constructor(transport: Transport<string>, scrambleKey?: string);
    getVersion(): Promise<GetVersionResponse>;
    _getVersion(): Interaction<Version>;
}
//# sourceMappingURL=fio.d.ts.map