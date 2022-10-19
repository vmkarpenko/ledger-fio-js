import type {HexString, ParsedActionAuthorisation, ParsedRegisterDomain, ParsedTransaction, Uint8_t, ValidBIP32Path} from "../../types/internal"
import { Command, VALUE_STORAGE_COMPARE, COMMAND_APPEND_CONST_DATA, COMMAND_SHOW_MESSAGE, COMMANDS_COUNTED_SECTION, COMMAND_STORE_VALUE, 
         COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW, COMMAND_APPEND_DATA_FIO_AMOUNT_SHOW, 
         ADD_STORAGE_CHECK,
         COMMAND_APPEND_DATA_STRING_WITH_LENGTH_SHOW,
         COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW} from "./commands"
import { uint64_to_buf } from "../../utils/serialize"
import { parseNameString, validate } from "../../utils/parse"
import { InvalidDataReason } from "../../errors";

const CONTRACT_ACCOUNT = parseNameString("fio.address", InvalidDataReason.UNEXPECTED_ERROR);
const CONTRACT_NAME = parseNameString("regdomain", InvalidDataReason.UNEXPECTED_ERROR);


export function template_regdomain(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    //Validate template expectations
    validate(tx.context_free_actions.length == 0, InvalidDataReason.CONTEXT_FREE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions[0].authorization.length == 1, InvalidDataReason.MULTIPLE_AUTHORIZATION_NOT_SUPPORTED);    

    // Template matching
    if (tx.actions[0].account !== CONTRACT_ACCOUNT || tx.actions[0].name !== CONTRACT_NAME) {
        return [];
    }

    const actionData: ParsedRegisterDomain = tx.actions[0].data as ParsedRegisterDomain;
    const authorization: ParsedActionAuthorisation = tx.actions[0].authorization[0];
    
    return [
        COMMAND_APPEND_CONST_DATA(tx.actions[0].account+tx.actions[0].name+"01" as HexString),
        COMMAND_SHOW_MESSAGE("Action", "Register FIO Domain"),
        COMMAND_STORE_VALUE(1 as Uint8_t, Buffer.from(tx.actions[0].authorization[0].actor, "hex")),
        ADD_STORAGE_CHECK(VALUE_STORAGE_COMPARE.COMPARE_REGISTER1, 
            COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW(Buffer.from(authorization.actor, "hex"), 8, 8)),
        COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW(Buffer.from(authorization.permission, "hex"), 8, 8),
        ...COMMANDS_COUNTED_SECTION([
            COMMAND_APPEND_DATA_STRING_WITH_LENGTH_SHOW("FIO Domain", Buffer.from(actionData.fio_domain), 1, 62),
            COMMAND_APPEND_DATA_STRING_WITH_LENGTH_SHOW("Owner Pubkey", Buffer.from(actionData.owner_fio_public_key)),
            COMMAND_APPEND_DATA_FIO_AMOUNT_SHOW("Max fee", uint64_to_buf(actionData.max_fee).reverse()), 
            ADD_STORAGE_CHECK(VALUE_STORAGE_COMPARE.COMPARE_REGISTER1, 
                COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW(Buffer.from(actionData.actor, "hex"), 8, 8)),
            COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW(Buffer.from(actionData.tpid)),
        ]),
    ];
}
