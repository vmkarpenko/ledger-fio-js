/// <reference types="node" />
/// <reference types="ledgerhq__hw-transport" />
import type Transport from "@ledgerhq/hw-transport";
import type { DeviceCompatibility, Version, Serial, BIP32Path, PublicKey, Transaction, SignedTransactionData } from './types/public';
import type { ValidBIP32Path } from './types/internal';
import type { Interaction, SendParams } from './interactions/common/types';
export * from './errors';
export * from './types/public';
export declare type SendFn = (params: SendParams) => Promise<Buffer>;
export declare class Fio {
    transport: Transport<string>;
    _send: SendFn;
    constructor(transport: Transport<string>, scrambleKey?: string);
    getVersion(): Promise<GetVersionResponse>;
    _getVersion(): Interaction<Version>;
    getSerial(): Promise<GetSerialResponse>;
    _getSerial(): Interaction<GetSerialResponse>;
    getPublicKey({ path }: GetPublicKeyRequest): Promise<GetPublicKeyResponse>;
    _getPublicKey(path: ValidBIP32Path): Generator<SendParams, PublicKey, Buffer>;
    signTransaction({ path, tx }: SignTransactionRequest): Promise<SignTransactionResponse>;
    _signTransaction(parsedPath: ValidBIP32Path, tx: Transaction): Generator<SendParams, SignedTransactionData, Buffer>;
    runTests(): Promise<void>;
    _runTests(): Interaction<void>;
}
export declare type GetVersionResponse = {
    version: Version;
    compatibility: DeviceCompatibility;
};
export declare type GetSerialResponse = Serial;
export declare type GetPublicKeyRequest = {
    path: BIP32Path;
};
export declare type GetPublicKeyResponse = PublicKey;
export declare type SignTransactionRequest = {
    path: BIP32Path;
    tx: Transaction;
};
export declare type SignTransactionResponse = SignedTransactionData;
export default Fio;
//# sourceMappingURL=fio.d.ts.map