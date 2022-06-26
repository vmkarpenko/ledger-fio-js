import  {InvalidData, InvalidDataReason} from "../errors"
import type {
    _Uint64_bigint,
    _Uint64_num,
    FixlenHexString,
    HexString,
    NameString,
    ParsedActionAuthorisation,
    ParsedTransaction,
    Uint8_t,
    Uint16_t,
    Uint32_t,
    Uint64_str,
    ValidBIP32Path,
    VarlenAsciiString,
    ParsedAction, 
    ParsedTransferFIOTokensData,
    ParsedRequestFundsData,
} from "../types/internal"
import type {ActionAuthorisation, bigint_like, Transaction, TransferFIOTokensData, RequestFundsData} from "../types/public"
import { CONTRACT_ACCOUNT_NAME_NEWFUNDSREQ } from "../interactions/transactionTemplates/template_newfundsreq"
import { CONTRACT_ACCOUNT_NAME_TRNSFIOPUBKEY } from "../interactions/transactionTemplates/template_trnsfiopubky"

export const MAX_UINT_64_STR = "18446744073709551615"

export const isString = (data: unknown): data is string =>
    typeof data === "string"

export const isInteger = (data: unknown): data is number =>
    Number.isInteger(data)

export const isBigIntLike = (data: unknown): data is bigint_like => {
    if (typeof data === "number") return true
    if (typeof data == "bigint") return true
    if (typeof data == "string" && !isNaN(parseInt(data))) return true
    return false
}

export const isArray = (data: unknown): data is Array<unknown> =>
    Array.isArray(data)

export const isBuffer = (data: unknown): data is Buffer =>
    Buffer.isBuffer(data)

export const isUint32 = (data: unknown): data is Uint32_t =>
    isInteger(data) && data >= 0 && data <= 4294967295

export const isUint16 = (data: unknown): data is Uint16_t =>
    isInteger(data) && data >= 0 && data <= 65535

export const isUint8 = (data: unknown): data is Uint8_t =>
    isInteger(data) && data >= 0 && data <= 255

export const isHexString = (data: unknown): data is HexString =>
    isString(data) && data.length % 2 === 0 && /^[0-9a-fA-F]*$/.test(data)

export const isHexStringOfLength = <L extends number>(data: unknown, expectedByteLength: L): data is FixlenHexString<L> =>
    isHexString(data) && data.length === expectedByteLength * 2

export const isValidPath = (data: unknown): data is ValidBIP32Path =>
    isArray(data) && data.every(x => isUint32(x)) && data.length <= 5

export const isUint64str = (data: unknown): data is Uint64_str =>
    isUintStr(data, {})

export const isUint64Number = (data: unknown): data is _Uint64_num =>
    isInteger(data) && data >= 0 && data <= Number.MAX_SAFE_INTEGER

export const isUint64Bigint = (data: unknown): data is _Uint64_bigint =>
    (typeof data === 'bigint') && isUint64str(data.toString())

export const isUintStr = (data: unknown, constraints: { min?: string, max?: string }): data is string => {
    const min = constraints.min ?? "0"
    const max = constraints.max ?? MAX_UINT_64_STR

    return isString(data)
        && /^[0-9]*$/.test(data)
        // Length checks
        && data.length > 0
        && data.length <= max.length
        // Leading zeros
        && (data.length === 1 || data[0] !== "0")
        // less or equal than max value
        && (data.length < max.length ||
            // Note: this is string comparison!
            data <= max)
        && (data.length > min.length ||
            // Note: this is string comparison!
            data >= min)
}

export const MAX_NAME_STRING_LENGTH = 12

export const isNameString = (data: unknown): data is NameString => {
    return isString(data)
        && data.length > 0
        && data.length <= MAX_NAME_STRING_LENGTH
        && /([1-5]|[a-z]|\.)+/.test(data)
}

export function validate(cond: boolean, errMsg: InvalidDataReason): asserts cond {
    if (!cond) throw new InvalidData(errMsg)
}


export function parseAscii(str: unknown, errMsg: InvalidDataReason): VarlenAsciiString {
    validate(isString(str), errMsg)
    validate(
        str.split("").every((c) => c.charCodeAt(0) >= 32 && c.charCodeAt(0) <= 126),
        errMsg,
    )
    return str as VarlenAsciiString
}


export function parseHexString(str: unknown, errMsg: InvalidDataReason): HexString {
    validate(isHexString(str), errMsg)
    return str
}

export function parseHexStringOfLength<L extends number>(str: unknown, length: L, errMsg: InvalidDataReason): FixlenHexString<L> {
    validate(isHexStringOfLength(str, length), errMsg)
    return str
}

export function parseUint64_str(val: unknown, constraints: { min?: string, max?: string }, errMsg: InvalidDataReason): Uint64_str {
    switch (typeof val) {
    case 'string':
        validate(isUint64str(val) && isUintStr(val, constraints), errMsg)
        return val
    case 'number':
        validate(isUint64Number(val) && isUintStr(val.toString(), constraints), errMsg)
        return val.toString() as Uint64_str
    case 'bigint':
        validate(isUint64Bigint(val) && isUintStr(val.toString(), constraints), errMsg)
        return val.toString() as Uint64_str
    default:
        validate(false, errMsg)
    }
}

export function parseUint32_t(value: unknown, errMsg: InvalidDataReason): Uint32_t {
    validate(isUint32(value), errMsg)
    return value
}

export function parseUint16_t(value: unknown, errMsg: InvalidDataReason): Uint16_t {
    validate(isUint16(value), errMsg)
    return value
}

export function parseUint8_t(value: number, errMsg: InvalidDataReason): Uint8_t {
    validate(isUint8(value), errMsg)
    return value
}

export function parseBIP32Path(value: unknown, errMsg: InvalidDataReason): ValidBIP32Path {
    validate(isValidPath(value), errMsg)
    return value
}

export function parseIntFromStr(str: string, errMsg: InvalidDataReason): number {
    validate(isString(str), errMsg)
    const i = parseInt(str)
    // Check that we parsed everything
    validate("" + i === str, errMsg)
    // Could be invalid
    validate(!isNaN(i), errMsg)
    // Could still be float
    validate(isInteger(i), errMsg)
    return i
}

export function parseNameString(name: string, errMsg: InvalidDataReason): NameString {
    validate(isNameString(name), errMsg)

    //from fiojs/src/chain-serialize.ts SerialBuffer.pushName
    function charToSymbol(c: number) {
        if (c >= 'a'.charCodeAt(0) && c <= 'z'.charCodeAt(0)) {
            return (c - 'a'.charCodeAt(0)) + 6
        }
        if (c >= '1'.charCodeAt(0) && c <= '5'.charCodeAt(0)) {
            return (c - '1'.charCodeAt(0)) + 1
        }
        return 0
    }

    const a = new Uint8Array(8)
    let bit = 63
    for (let i = 0; i < name.length; ++i) {
        let c = charToSymbol(name.charCodeAt(i))
        if (bit < 5) {
            c = c << 1
        }
        for (let j = 4; j >= 0; --j) {
            if (bit >= 0) {
                a[Math.floor(bit / 8)] |= ((c >> j) & 1) << (bit % 8)
                --bit
            }
        }
    }
    return Buffer.from(a).toString('hex') as NameString
}

export function parseAuthorization(authorization: ActionAuthorisation, errMsg: InvalidDataReason): ParsedActionAuthorisation {
    return {
        actor: parseNameString(authorization.actor, errMsg),
        permission: parseNameString(authorization.permission, errMsg),
    }
}

export function parseTransaction(chainId: string, tx: Transaction): ParsedTransaction {
    // validate tx (Transaction)
    validate(isString(tx.expiration), InvalidDataReason.INVALID_EXPIRATION)
    validate(isBigIntLike(tx.ref_block_num), InvalidDataReason.INVALID_REF_BLOCK_NUM)
    validate(isBigIntLike(tx.ref_block_prefix), InvalidDataReason.INVALID_REF_BLOCK_PREFIX)
    validate(tx.context_free_actions.length == 0, InvalidDataReason.CONTEXT_FREE_ACTIONS_NOT_SUPPORTED)

    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED)
    const action = tx.actions[0]

    // validate action
    validate(isString(action.account), InvalidDataReason.INVALID_ACCOUNT)
    validate(isString(action.name), InvalidDataReason.INVALID_NAME)

    validate(action.authorization.length == 1, InvalidDataReason.MULTIPLE_AUTHORIZATION_NOT_SUPPORTED)
    const authorization = action.authorization[0]

    // validate authorization
    validate(isString(authorization.actor), InvalidDataReason.INVALID_ACTOR)
    validate(isString(authorization.permission), InvalidDataReason.INVALID_PERMISSION)


    if (action.account == "fio.token" && action.name == "trnsfiopubky") {
        const data: TransferFIOTokensData = action.data;

        // validate action.data (TransferFIOTokenData)
        validate(isString(data.payee_public_key), InvalidDataReason.INVALID_PAYEE_PUBKEY)
        validate(data.payee_public_key.length <= 64, InvalidDataReason.INVALID_PAYEE_PUBKEY) 
        validate(isBigIntLike(data.amount), InvalidDataReason.INVALID_AMOUNT)
        validate(isBigIntLike(data.max_fee), InvalidDataReason.INVALID_MAX_FEE)
        validate(isString(data.tpid), InvalidDataReason.INVALID_TPID)
        validate(data.tpid.length <= 20, InvalidDataReason.INVALID_TPID) 
        validate(isString(data.actor), InvalidDataReason.INVALID_ACTOR)

        const parsedActionData: ParsedTransferFIOTokensData = {
            payee_public_key: data.payee_public_key,
            amount: parseUint64_str(data.amount, {}, InvalidDataReason.INVALID_AMOUNT),
            max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
            actor: parseNameString(data.actor, InvalidDataReason.INVALID_ACTOR),
            tpid: data.tpid,
        }
    
        const parsedAction: ParsedAction = {
            contractAccountName:  CONTRACT_ACCOUNT_NAME_TRNSFIOPUBKEY as HexString,
            authorization: [parseAuthorization(authorization, InvalidDataReason.INVALID_ACTION_AUTHORIZATION)],
            data: parsedActionData,
        }
    
        return {
            expiration: tx.expiration,
            ref_block_num: parseUint16_t(tx.ref_block_num, InvalidDataReason.INVALID_REF_BLOCK_NUM),
            ref_block_prefix: parseUint32_t(tx.ref_block_prefix, InvalidDataReason.INVALID_REF_BLOCK_PREFIX),
            context_free_actions: [],
            actions: [parsedAction],
            transaction_extensions: null,
        }    
    }
    else if (action.account === "fio.reqobt" && action.name === "newfundsreq") {
        const data: RequestFundsData = action.data as RequestFundsData;
        validate(isString(data.tpid), InvalidDataReason.INVALID_TPID)
        validate(data.tpid.length <= 20, InvalidDataReason.INVALID_TPID) 
        validate(isString(data.actor), InvalidDataReason.INVALID_ACTOR)
        validate(isString(data.payer_fio_address), InvalidDataReason.INVALID_PAYER_FIO_ADDRESS)
        validate(isString(data.payee_fio_address), InvalidDataReason.INVALID_PAYEE_FIO_ADDRESS)
        validate(isString(data.payee_public_address), InvalidDataReason.INVALID_AMOUNT)
        validate(isString(data.amount), InvalidDataReason.INVALID_AMOUNT)
        validate(isString(data.chain_code), InvalidDataReason.INVALID_CHAIN_CODE)
        validate(isString(data.token_code), InvalidDataReason.INVALID_TOKEN_CODE)
        validate(isString(data.memo), InvalidDataReason.INVALID_MEMO)
        validate(isString(data.hash), InvalidDataReason.INVALID_HASH) 
        validate(isString(data.offline_url), InvalidDataReason.INVALID_OFFLINE_URL) 

        let payee_public_key: Buffer
        try {
            console.log(data.payee_public_key)
            payee_public_key = data.payee_public_key.toUncompressed().toBuffer()
        }
        catch {
            validate(false, InvalidDataReason.INVALID_PUBLIC_KEY)
        }
        validate(payee_public_key.length == 65, InvalidDataReason.INVALID_PUBLIC_KEY) 

        const parsedActionData: ParsedRequestFundsData = {
            payer_fio_address: data.payer_fio_address,
            payee_fio_address: data.payee_fio_address,
            max_fee: parseUint64_str(action.data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
            actor: data.actor,
            tpid: data.tpid,

            payee_public_key: payee_public_key,
            payee_public_address: data.payee_public_address,
            amount: data.amount,
            chain_code: data.chain_code,
            token_code: data.token_code,
            memo: data.memo,
            hash: data.hash,
            offline_url: data.offline_url,
        }
    
        const parsedAction: ParsedAction = {
            contractAccountName: CONTRACT_ACCOUNT_NAME_NEWFUNDSREQ as HexString,
            authorization: [parseAuthorization(authorization, InvalidDataReason.INVALID_ACTION_AUTHORIZATION)],
            data: parsedActionData,
        }
    
        return {
            expiration: tx.expiration,
            ref_block_num: parseUint16_t(tx.ref_block_num, InvalidDataReason.INVALID_REF_BLOCK_NUM),
            ref_block_prefix: parseUint32_t(tx.ref_block_prefix, InvalidDataReason.INVALID_REF_BLOCK_PREFIX),
            context_free_actions: [],
            actions: [parsedAction],
            transaction_extensions: null,
        }    
    }

    throw new InvalidData(InvalidDataReason.ACTION_NOT_SUPPORTED)
}

