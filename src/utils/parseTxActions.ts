import { TransferFIOTokensData, RequestFundsData, RecordOtherBlockchainTransactionMetadata, MapBlockchainPublicAddress,
    PublicAddress } from "fio";
import  { InvalidDataReason } from "../errors"
import {
    _Uint64_bigint,
    _Uint64_num,
    HexString,
    ParsedAction, 
    ParsedTransferFIOTokensData,
    ParsedRequestFundsData,
    ParsedRecordOtherBlockchainTransactionMetadata,
    PUBLIC_KEY_LENGTH,
    ParsedMapBlockchainPublicAddress,
    ParsedPublicAddress,
} from "../types/internal"
import { parseAscii, parseHexString, parseNameString, parseUint64_str, validate } from "./parse";


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
    return {
        payer_fio_address: parseAscii(data.payer_fio_address, InvalidDataReason.INVALID_PAYER_FIO_ADDRESS, 3, 64),
        payee_fio_address: parseAscii(data.payee_fio_address, InvalidDataReason.INVALID_PAYEE_FIO_ADDRESS, 3, 64),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseAscii(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),

        payee_public_key: parseHexString(data.payee_public_key, InvalidDataReason.INVALID_PUBLIC_KEY, PUBLIC_KEY_LENGTH, PUBLIC_KEY_LENGTH),
        payee_public_address: parseAscii(data.payee_public_address, InvalidDataReason.INVALID_PAYEE_FIO_ADDRESS),
        amount: parseAscii(data.amount, InvalidDataReason.INVALID_AMOUNT),
        chain_code: parseAscii(data.chain_code, InvalidDataReason.INVALID_CHAIN_CODE, 1, 10),
        token_code: parseAscii(data.token_code, InvalidDataReason.INVALID_TOKEN_CODE, 1, 10),
        ...data.memo ? {memo: parseAscii(data.memo, InvalidDataReason.INVALID_MEMO)}:{},
        ...data.hash ? {hash: parseAscii(data.hash, InvalidDataReason.INVALID_HASH)}:{},
        ...data.offline_url ? {offline_url: parseAscii(data.offline_url, InvalidDataReason.INVALID_OFFLINE_URL)}:{},
    }
}

export function parseActionDataRecordOtherBlockchainTransactionMetadata(data: RecordOtherBlockchainTransactionMetadata): ParsedRecordOtherBlockchainTransactionMetadata {
    return {
        fio_request_id: parseAscii(data.fio_request_id, InvalidDataReason.INVALID_FIO_REQUEST_ID, 3, 64),
        payer_fio_address: parseAscii(data.payer_fio_address, InvalidDataReason.INVALID_PAYER_FIO_ADDRESS, 3, 64),
        payee_fio_address: parseAscii(data.payee_fio_address, InvalidDataReason.INVALID_PAYEE_FIO_ADDRESS, 3, 64),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseAscii(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),

        payee_public_key: parseHexString(data.payee_public_key, InvalidDataReason.INVALID_PUBLIC_KEY, PUBLIC_KEY_LENGTH, PUBLIC_KEY_LENGTH),
        payer_public_address: parseAscii(data.payer_public_address, InvalidDataReason.INVALID_PAYER_PUBLIC_ADDRESS),
        payee_public_address: parseAscii(data.payee_public_address, InvalidDataReason.INVALID_PAYEE_PUBLIC_ADDRESS),
        amount: parseAscii(data.amount, InvalidDataReason.INVALID_AMOUNT),
        chain_code: parseAscii(data.chain_code, InvalidDataReason.INVALID_CHAIN_CODE, 1, 10),
        token_code: parseAscii(data.token_code, InvalidDataReason.INVALID_TOKEN_CODE, 1, 10),
        status: parseAscii(data.status, InvalidDataReason.INVALID_STATUS),
        obt_id: parseAscii(data.obt_id, InvalidDataReason.INVALID_OBT_ID),
        ...data.memo ? {memo: parseAscii(data.memo, InvalidDataReason.INVALID_MEMO)}:{},
        ...data.hash ? {hash: parseAscii(data.hash, InvalidDataReason.INVALID_HASH)}:{},
        ...data.offline_url ? {offline_url: parseAscii(data.offline_url, InvalidDataReason.INVALID_OFFLINE_URL)}:{},
    }
}

function parsePublicAddress(a: PublicAddress): ParsedPublicAddress {
    return {
        chain_code: parseAscii(a.chain_code, InvalidDataReason.INVALID_CHAIN_CODE, 1, 10),
        token_code: parseAscii(a.token_code, InvalidDataReason.INVALID_TOKEN_CODE, 1, 10),
        public_address: parseAscii(a.public_address, InvalidDataReason.INVALID_TOKEN_CODE, 3, 64),
    }
}

function parsePublicAddsesses(a: Array<PublicAddress>): Array<ParsedPublicAddress> {
    validate(1 <= a.length && a.length <= 5, InvalidDataReason.INCORRECT_NUMBER_OF_PUBLIC_ADDRESSES)
    return a.map( e => parsePublicAddress(e))
}

export function parseMapBlockchainPublicAddress(data: MapBlockchainPublicAddress): ParsedMapBlockchainPublicAddress {
    return {
        fio_address: parseAscii(data.fio_address, InvalidDataReason.INVALID_FIO_ADDRESS, 3, 64),
        public_addresses: parsePublicAddsesses(data.public_addresses),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseNameString(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),
    }
}