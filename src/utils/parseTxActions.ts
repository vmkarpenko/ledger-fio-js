import { TransferFIOTokensData, RequestFundsData } from "fio";
import  {InvalidData, InvalidDataReason} from "../errors"
import type {
    _Uint64_bigint,
    _Uint64_num,
    HexString,
    ParsedAction, 
    ParsedTransferFIOTokensData,
    ParsedRequestFundsData,
} from "../types/internal"
import { parseAscii, parseNameString, parseUint64_str, validate } from "./parse";


export function parseActionDataTransferFIOToken(data: TransferFIOTokensData): ParsedTransferFIOTokensData {
    return {
        payee_public_key: parseAscii(data.payee_public_key, InvalidDataReason.INVALID_PAYEE_PUBKEY, 0, 64),
        amount: parseUint64_str(data.amount, {}, InvalidDataReason.INVALID_AMOUNT),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseNameString(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),
    }    
}


export function parseActionDataRequestFunds(data: RequestFundsData): ParsedRequestFundsData {
    let payee_public_key: Buffer
    try {
        payee_public_key = data.payee_public_key.toUncompressed().toBuffer()
    }
    catch {
        validate(false, InvalidDataReason.INVALID_PUBLIC_KEY)
    }
    validate(payee_public_key.length == 65, InvalidDataReason.INVALID_PUBLIC_KEY) 
    
    return {
        payer_fio_address: parseAscii(data.payer_fio_address, InvalidDataReason.INVALID_PAYER_FIO_ADDRESS),
        payee_fio_address: parseAscii(data.payee_fio_address, InvalidDataReason.INVALID_PAYEE_FIO_ADDRESS),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseAscii(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),

        payee_public_key: payee_public_key,
        payee_public_address: parseAscii(data.payee_public_address, InvalidDataReason.INVALID_PAYEE_FIO_ADDRESS),
        amount: parseAscii(data.amount, InvalidDataReason.INVALID_AMOUNT),
        chain_code: parseAscii(data.chain_code, InvalidDataReason.INVALID_CHAIN_CODE),
        token_code: parseAscii(data.token_code, InvalidDataReason.INVALID_TOKEN_CODE),
        ...data.memo ? {memo: parseAscii(data.memo, InvalidDataReason.INVALID_MEMO)}:{},
        ...data.hash ? {hash: parseAscii(data.hash, InvalidDataReason.INVALID_HASH)}:{},
        ...data.offline_url ? {offline_url: parseAscii(data.offline_url, InvalidDataReason.INVALID_OFFLINE_URL)}:{},
    }
}


