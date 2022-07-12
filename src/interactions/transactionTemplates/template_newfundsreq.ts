import type {HexString, ParsedTransaction, ParsedRequestFundsData, ValidBIP32Path, ParsedActionAuthorisation, Uint8_t} from "../../types/internal"
import { Command, templateAlternative, COMMANDS_COUNTED_SECTION, COMMAND_APPEND_DATA_STRING_SHOW, COMMAND_APPEND_CONST_DATA, 
         COMMAND_SHOW_MESSAGE, COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW, COMMANDS_DH_ENCODE, COMMAND_APPEND_DATA_FIO_AMOUNT_SHOW, 
         COMMAND_APPEND_DATA_STRING_DO_NOT_SHOW, ADD_STORAGE_CHECK, VALUE_STORAGE_COMPARE, COMMAND_STORE_VALUE, COMMAND_APPEND_DATA_MEMO_HASH, COMMAND_APPEND_DATA_STRING_WITH_LENGTH_SHOW, COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW } from "./commands"
import { uint64_to_buf } from "../../utils/serialize"
import { parseNameString, validate } from "../../utils/parse"
import { InvalidDataReason } from "../../errors";

const CONTRACT_ACCOUNT = parseNameString("fio.reqobt", InvalidDataReason.UNEXPECTED_ERROR);
const CONTRACT_NAME = parseNameString("newfundsreq", InvalidDataReason.UNEXPECTED_ERROR);

export function template_newfundsreq(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    // Validate template expectations
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);
    
    // Template matching
    if (tx.actions[0].account !== CONTRACT_ACCOUNT || tx.actions[0].name !== CONTRACT_NAME) {
        return [];
    }

    const actionData: ParsedRequestFundsData = tx.actions[0].data as ParsedRequestFundsData;
    const authorization: ParsedActionAuthorisation = tx.actions[0].authorization[0];

    return [
        COMMAND_APPEND_CONST_DATA(tx.actions[0].account+tx.actions[0].name+"01" as HexString),
        COMMAND_SHOW_MESSAGE("Action", "Request Funds"),
        COMMAND_STORE_VALUE(1 as Uint8_t, Buffer.from(authorization.actor, "hex")),
        ADD_STORAGE_CHECK(VALUE_STORAGE_COMPARE.COMPARE_REGISTER1, 
            COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW(Buffer.from(authorization.actor, "hex"), 8, 8)),
        COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW(Buffer.from(authorization.permission, "hex"), 8, 8),
        ...COMMANDS_COUNTED_SECTION([
            COMMAND_APPEND_DATA_STRING_WITH_LENGTH_SHOW("Payer FIO Cr. H.", Buffer.from(actionData.payer_fio_address), 3, 64),
            COMMAND_APPEND_DATA_STRING_WITH_LENGTH_SHOW("Payee FIO Cr. H.", Buffer.from(actionData.payee_fio_address), 3, 64),
            ...COMMANDS_COUNTED_SECTION([
                ...COMMANDS_DH_ENCODE(Buffer.from(actionData.payee_public_key, "hex"), [
                    COMMAND_APPEND_DATA_STRING_WITH_LENGTH_SHOW("Payee Public Addr", Buffer.from(actionData.payee_public_address)),
                    COMMAND_APPEND_DATA_STRING_WITH_LENGTH_SHOW("Amount requested", Buffer.from(actionData.amount)),
                    COMMAND_APPEND_DATA_STRING_WITH_LENGTH_SHOW("Chain code", Buffer.from(actionData.chain_code), 1, 10),
                    COMMAND_APPEND_DATA_STRING_WITH_LENGTH_SHOW("Token code", Buffer.from(actionData.token_code), 1, 10),
                    COMMAND_APPEND_DATA_MEMO_HASH(actionData.memo, actionData.hash, actionData.offline_url),
                ])
            ], 64, 296),
            COMMAND_APPEND_DATA_FIO_AMOUNT_SHOW("Max fee", uint64_to_buf(actionData.max_fee).reverse()),
            ...COMMANDS_COUNTED_SECTION([
                ADD_STORAGE_CHECK(VALUE_STORAGE_COMPARE.COMPARE_REGISTER1_DECODE_NAME, 
                    COMMAND_APPEND_DATA_STRING_DO_NOT_SHOW(Buffer.from(actionData.actor), 0, 14)),
            ]),
            COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW(Buffer.from(actionData.tpid)),
        ]),
    ];
}
