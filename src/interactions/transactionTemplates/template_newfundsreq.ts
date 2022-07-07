import type {HexString, ParsedTransaction, ParsedRequestFundsData, ValidBIP32Path, ParsedActionAuthorisation, Uint8_t} from "../../types/internal"
import { Command, templateAlternative, COMMANDS_COUNTED_SECTION, COMMAND_APPEND_DATA_STRING_SHOW, COMMAND_APPEND_CONST_DATA, 
         COMMAND_SHOW_MESSAGE, COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW, COMMANDS_DH_ENCODE, COMMAND_APPEND_DATA_FIO_AMOUNT_SHOW, 
         COMMAND_APPEND_DATA_STRING_DO_NOT_SHOW, ADD_STORAGE_CHECK, VALUE_STORAGE_COMPARE, COMMAND_STORE_VALUE } from "./commands"
import { uint64_to_buf } from "../../utils/serialize"
import { parseNameString, validate } from "../../utils/parse"
import { InvalidDataReason } from "../../errors";

const CONTRACT_ACCOUNT = parseNameString("fio.reqobt", InvalidDataReason.UNEXPECTED_ERROR);
const CONTRACT_NAME = parseNameString("newfundsreq", InvalidDataReason.UNEXPECTED_ERROR);

function template_newfundsreq_memo(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions[0].account === CONTRACT_ACCOUNT, InvalidDataReason. ACTION_NOT_SUPPORTED);
    validate(tx.actions[0].name === CONTRACT_NAME, InvalidDataReason. ACTION_NOT_SUPPORTED);

    const actionData: ParsedRequestFundsData = tx.actions[0].data as ParsedRequestFundsData;

    //Matching template
    if (!actionData.memo) {
        return []
    }
    validate(!actionData.hash, InvalidDataReason.INVALID_HASH)
    validate(!actionData.offline_url, InvalidDataReason.INVALID_OFFLINE_URL)
    
    return [
        COMMAND_APPEND_CONST_DATA("01" as HexString),
        ...COMMANDS_COUNTED_SECTION([
            COMMAND_APPEND_DATA_STRING_SHOW("Memo", Buffer.from(actionData.memo as string)),
        ]),
        COMMAND_APPEND_CONST_DATA("0000" as HexString),
    ]
}

function template_newfundsreq_hash(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions[0].account === CONTRACT_ACCOUNT, InvalidDataReason. ACTION_NOT_SUPPORTED);
    validate(tx.actions[0].name === CONTRACT_NAME, InvalidDataReason. ACTION_NOT_SUPPORTED);

    const actionData: ParsedRequestFundsData = tx.actions[0].data as ParsedRequestFundsData;

    //Matching template
    if (!actionData.hash || !actionData.offline_url) {
        return []
    }
    validate(!actionData.memo, InvalidDataReason.INVALID_MEMO)

    return [
        COMMAND_APPEND_CONST_DATA("0001" as HexString),
        ...COMMANDS_COUNTED_SECTION([
            COMMAND_APPEND_DATA_STRING_SHOW("Hash", Buffer.from(actionData.hash)),
        ], 0, 0xFFFFFFFFFFFF),
        COMMAND_APPEND_CONST_DATA("01" as HexString),
        ...COMMANDS_COUNTED_SECTION([
            COMMAND_APPEND_DATA_STRING_SHOW("Offline url", Buffer.from(actionData.offline_url)),
        ], 0, 0xFFFFFFFFFFFF),
    ]
}

export function template_newfundsreq(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    // Validate template expectations
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);
    
    // Template matching
    if (tx.actions[0].account !== CONTRACT_ACCOUNT || tx.actions[0].name !== CONTRACT_NAME) {
        return [];
    }

    const actionData: ParsedRequestFundsData = tx.actions[0].data as ParsedRequestFundsData;
    const authorization: ParsedActionAuthorisation = tx.actions[0].authorization[0];

    const memoAndHash: Array<Command> = templateAlternative([template_newfundsreq_memo, template_newfundsreq_hash])(chainId, tx, parsedPath)
    validate(memoAndHash.length !== 0, InvalidDataReason.INVALID_MEMO)

    return [
        COMMAND_APPEND_CONST_DATA(tx.actions[0].account+tx.actions[0].name+"01" as HexString),
        COMMAND_SHOW_MESSAGE("Action", "Request Funds"),
        COMMAND_STORE_VALUE(1 as Uint8_t, Buffer.from(authorization.actor, "hex")),
        ADD_STORAGE_CHECK(VALUE_STORAGE_COMPARE.COMPARE_REGISTER1, 
            COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW(Buffer.from(authorization.actor, "hex"), 8, 8)),
        COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW(Buffer.from(authorization.permission, "hex"), 8, 8),
        ...COMMANDS_COUNTED_SECTION([
            ...COMMANDS_COUNTED_SECTION([
                COMMAND_APPEND_DATA_STRING_SHOW("Payer FIO Address", Buffer.from(actionData.payer_fio_address), 3, 64)
            ]), 
            ...COMMANDS_COUNTED_SECTION([
                COMMAND_APPEND_DATA_STRING_SHOW("Payee FIO Address", Buffer.from(actionData.payee_fio_address), 3, 64)
            ]), 
            ...COMMANDS_COUNTED_SECTION([
                ...COMMANDS_DH_ENCODE(Buffer.from(actionData.payee_public_key, "hex"), [
                    ...COMMANDS_COUNTED_SECTION([
                        COMMAND_APPEND_DATA_STRING_SHOW("Payee Public Addr.", Buffer.from(actionData.payee_public_address)),
                    ]),
                    ...COMMANDS_COUNTED_SECTION([
                        COMMAND_APPEND_DATA_STRING_SHOW("Amount requested", Buffer.from(actionData.amount)),
                    ]),
                    ...COMMANDS_COUNTED_SECTION([
                        COMMAND_APPEND_DATA_STRING_SHOW("Chain code", Buffer.from(actionData.chain_code), 1, 10),
                    ]),
                    ...COMMANDS_COUNTED_SECTION([
                        COMMAND_APPEND_DATA_STRING_SHOW("Token code", Buffer.from(actionData.token_code), 1, 10),
                    ]),
                    ...memoAndHash,
                ])
            ], 64, 296),
            COMMAND_APPEND_DATA_FIO_AMOUNT_SHOW("Max fee", uint64_to_buf(actionData.max_fee).reverse()),
            ...COMMANDS_COUNTED_SECTION([
                ADD_STORAGE_CHECK(VALUE_STORAGE_COMPARE.COMPARE_REGISTER1_DECODE_NAME, 
                    COMMAND_APPEND_DATA_STRING_DO_NOT_SHOW(Buffer.from(actionData.actor), 0, 14)),
            ]),
            ...COMMANDS_COUNTED_SECTION([
                COMMAND_APPEND_DATA_STRING_DO_NOT_SHOW(Buffer.from(actionData.tpid), 0, 21),
            ]),
        ]),
    ];
}
