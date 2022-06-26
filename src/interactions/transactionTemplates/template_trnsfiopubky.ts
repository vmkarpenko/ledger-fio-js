import type {HexString, ParsedActionAuthorisation, ParsedTransaction, ParsedTransferFIOTokensData, Uint8_t, ValidBIP32Path} from "../../types/internal"
import { COMMAND, Command, constDataAppendData, VALUE_FORMAT, VALUE_VALIDATION, VALUE_POLICY, VALUE_STORAGE_COMPARE, defaultCommand, 
         COMMAND_APPEND_CONST_DATA, COMMAND_SHOW_MESSAGE, COMMANDS_COUNTED_SECTION, COMMAND_STORE_VALUE, 
         COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW, COMMAND_APPEND_DATA_STRING_SHOW, COMMAND_APPEND_DATA_FIO_AMOUNT_SHOW, 
         COMMAND_APPEND_DATA_STRING_DO_NOT_SHOW} from "./commands"
import { uint64_to_buf } from "../../utils/serialize"
import { validate } from "../../utils/parse"
import { InvalidDataReason } from "../../errors";

export const CONTRACT_ACCOUNT_NAME_TRNSFIOPUBKEY = "0000980ad20ca85be0e1d195ba85e7cd"

export function template_trnsfiopubky(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    //Validate template expectations
    validate(tx.context_free_actions.length == 0, InvalidDataReason.CONTEXT_FREE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions[0].authorization.length == 1, InvalidDataReason.MULTIPLE_AUTHORIZATION_NOT_SUPPORTED);    

    //Template matching
    if (tx.actions[0].contractAccountName !== CONTRACT_ACCOUNT_NAME_TRNSFIOPUBKEY) return [];

    const actionData: ParsedTransferFIOTokensData = tx.actions[0].data as ParsedTransferFIOTokensData;
    const authorization: ParsedActionAuthorisation = tx.actions[0].authorization[0];

    return [
        COMMAND_APPEND_CONST_DATA(CONTRACT_ACCOUNT_NAME_TRNSFIOPUBKEY+"01" as HexString),
        COMMAND_SHOW_MESSAGE("Action", "Transfer FIO tokens"),
        COMMAND_STORE_VALUE(1 as Uint8_t, Buffer.from(tx.actions[0].authorization[0].actor, "hex")),
        {
            // Authorisation actor, validate that it is stored
            ...defaultCommand,
            command: COMMAND.APPEND_DATA, 
            constData: constDataAppendData(
                VALUE_FORMAT.VALUE_FORMAT_NAME,
                VALUE_VALIDATION.VALUE_VALIDATION_NONE, BigInt(0), BigInt(0),
                VALUE_POLICY.VALUE_DO_NOT_SHOW_ON_DEVICE,
                VALUE_STORAGE_COMPARE.COMPARE_REGISTER1,
                ""
            ),
            varData: Buffer.from(authorization.actor, "hex"),
            txLen: 8,
        },
        COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW(Buffer.from(authorization.permission, "hex"), 8, 8),
        ...COMMANDS_COUNTED_SECTION([
            ...COMMANDS_COUNTED_SECTION([
                COMMAND_APPEND_DATA_STRING_SHOW("Payee Pubkey", Buffer.from(actionData.payee_public_key), 0, 55),
            ]),
            COMMAND_APPEND_DATA_FIO_AMOUNT_SHOW("Amount", uint64_to_buf(actionData.amount).reverse()), 
            COMMAND_APPEND_DATA_FIO_AMOUNT_SHOW("Max fee", uint64_to_buf(actionData.max_fee).reverse()), 
            {
                ...defaultCommand,
                command: COMMAND.APPEND_DATA, 
                constData: constDataAppendData(
                    VALUE_FORMAT.VALUE_FORMAT_NAME,
                    VALUE_VALIDATION.VALUE_VALIDATION_NONE, BigInt(0), BigInt(0),
                    VALUE_POLICY.VALUE_DO_NOT_SHOW_ON_DEVICE,
                    VALUE_STORAGE_COMPARE.COMPARE_REGISTER1,
                    ""
                ),
                varData: Buffer.from(actionData.actor, "hex"),
                txLen: 8,
            },
            ...COMMANDS_COUNTED_SECTION([
                COMMAND_APPEND_DATA_STRING_DO_NOT_SHOW(Buffer.from(actionData.tpid), 0, 21),
            ]),    
        ]),
    ];
}
