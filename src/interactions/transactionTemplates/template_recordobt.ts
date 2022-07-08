import type {HexString, ParsedTransaction, ParsedRequestFundsData, ValidBIP32Path, ParsedActionAuthorisation, ParsedRecordOtherBlockchainTransactionMetadata, Uint8_t} from "../../types/internal"
import { Command, templateAlternative, COMMANDS_COUNTED_SECTION, COMMAND_APPEND_DATA_STRING_SHOW, COMMAND_APPEND_CONST_DATA, 
        COMMAND_SHOW_MESSAGE, COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW, COMMAND_APPEND_DATA_NAME_SHOW, COMMANDS_DH_ENCODE, 
        COMMAND_APPEND_DATA_FIO_AMOUNT_SHOW, COMMAND_APPEND_DATA_STRING_DO_NOT_SHOW, COMMAND_STORE_VALUE, ADD_STORAGE_CHECK, VALUE_STORAGE_COMPARE, COMMAND_MEMO_HASH } from "./commands"
import { uint64_to_buf } from "../../utils/serialize"
import { parseNameString, validate } from "../../utils/parse"
import { InvalidDataReason } from "../../errors";

const CONTRACT_ACCOUNT = parseNameString("fio.reqobt", InvalidDataReason.UNEXPECTED_ERROR);
const CONTRACT_NAME = parseNameString("recordobt", InvalidDataReason.UNEXPECTED_ERROR);

export function template_recordopt(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    // Validate template expectations
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions[0].authorization.length == 1, InvalidDataReason.MULTIPLE_AUTHORIZATION_NOT_SUPPORTED);    

    // Template matching
    if (tx.actions[0].account !== CONTRACT_ACCOUNT || tx.actions[0].name !== CONTRACT_NAME) {
        return [];
    }

    const actionData: ParsedRecordOtherBlockchainTransactionMetadata = tx.actions[0].data as ParsedRecordOtherBlockchainTransactionMetadata;
    const authorization: ParsedActionAuthorisation = tx.actions[0].authorization[0];

    return [
        COMMAND_APPEND_CONST_DATA(tx.actions[0].account+tx.actions[0].name+"01" as HexString),
        COMMAND_SHOW_MESSAGE("Action", "Record other blockchain transaction metadata"),
        COMMAND_STORE_VALUE(1 as Uint8_t, Buffer.from(authorization.actor, "hex")),
        ADD_STORAGE_CHECK(VALUE_STORAGE_COMPARE.COMPARE_REGISTER1, 
            COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW(Buffer.from(authorization.actor, "hex"), 8, 8)),
        COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW(Buffer.from(authorization.permission, "hex"), 8, 8),
        ...COMMANDS_COUNTED_SECTION([
            ...COMMANDS_COUNTED_SECTION([
                COMMAND_APPEND_DATA_STRING_SHOW("Fio Request ID", Buffer.from(actionData.fio_request_id))
            ]), 
            ...COMMANDS_COUNTED_SECTION([
                COMMAND_APPEND_DATA_STRING_SHOW("Payer FIO Address", Buffer.from(actionData.payer_fio_address), 3, 64)
            ]), 
            ...COMMANDS_COUNTED_SECTION([
                COMMAND_APPEND_DATA_STRING_SHOW("Payee FIO Address", Buffer.from(actionData.payee_fio_address), 3, 64)
            ]), 
            ...COMMANDS_COUNTED_SECTION([
                ...COMMANDS_DH_ENCODE(Buffer.from(actionData.payee_public_key, "hex"), [
                    ...COMMANDS_COUNTED_SECTION([
                        COMMAND_APPEND_DATA_STRING_SHOW("Payer Public Addr.", Buffer.from(actionData.payer_public_address)),
                    ]),
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
                    ...COMMANDS_COUNTED_SECTION([
                        COMMAND_APPEND_DATA_STRING_SHOW("Status", Buffer.from(actionData.status)),
                    ]),
                    ...COMMANDS_COUNTED_SECTION([
                        COMMAND_APPEND_DATA_STRING_SHOW("Obt ID", Buffer.from(actionData.obt_id)),
                    ]),
                    COMMAND_MEMO_HASH(actionData.memo, actionData.hash, actionData.offline_url),
                ])
            ], 64, 432),
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