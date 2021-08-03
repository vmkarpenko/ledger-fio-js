/// <reference types="node" />
/// <reference types="ledgerhq__hw-transport" />
import type Transport from "@ledgerhq/hw-transport";
import type { Version, Serial, BIP32Path, ExtendedPublicKey } from './types/public';
import type { ValidBIP32Path } from './types/internal';
import type { Interaction, SendParams } from './interactions/common/types';
export * from './errors';
export * from './types/public';
export declare const enum INS {
    GET_VERSION = 0,
    GET_VERSION2 = 1
}
export declare type SendFn = (params: SendParams) => Promise<Buffer>;
export declare type GetVersionResponse = {
    version: Version;
    compatibility: Number;
};
export declare function getVersion(): Interaction<Version>;
export declare class Fio {
    transport: Transport<string>;
    _send: SendFn;
    constructor(transport: Transport<string>, scrambleKey?: string);
    getVersion(): Promise<GetVersionResponse>;
    _getVersion(): Interaction<Version>;
    getSerial(): Promise<GetSerialResponse>;
    _getSerial(): Interaction<GetSerialResponse>;
    getExtendedPublicKeys({ paths }: GetExtendedPublicKeysRequest): Promise<GetExtendedPublicKeysResponse>;
    _getExtendedPublicKeys(paths: ValidBIP32Path[]): Generator<SendParams, ExtendedPublicKey[], Buffer>;
    getExtendedPublicKey({ path }: GetExtendedPublicKeyRequest): Promise<GetExtendedPublicKeyResponse>;
}
export declare type GetSerialResponse = Serial;
export declare type GetExtendedPublicKeysRequest = {
    paths: BIP32Path[];
};
export declare type GetExtendedPublicKeysResponse = Array<ExtendedPublicKey>;
export declare type GetExtendedPublicKeyRequest = {
    path: BIP32Path;
};
export declare type GetExtendedPublicKeyResponse = ExtendedPublicKey;
//# sourceMappingURL=fio.d.ts.map