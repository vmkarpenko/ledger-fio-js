import type {HexString, ParsedTransaction, ParsedRequestFundsData, ValidBIP32Path, ParsedActionAuthorisation} from "../../types/internal"
import { Command, templateAlternative, COMMANDS_COUNTED_SECTION, COMMAND_APPEND_DATA_STRING_SHOW, COMMAND_APPEND_CONST_DATA, 
        COMMAND_SHOW_MESSAGE, COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW, COMMAND_APPEND_DATA_NAME_SHOW, COMMANDS_DH_ENCODE, 
        COMMAND_APPEND_DATA_FIO_AMOUNT_SHOW, COMMAND_APPEND_DATA_STRING_DO_NOT_SHOW } from "./commands"
import { uint64_to_buf } from "../../utils/serialize"
import { validate } from "../../utils/parse"
import { InvalidDataReason } from "../../errors";

export const CONTRACT_ACCOUNT_NAME_NEWFUNDSREQ = "00403ed4aa0ba85b00acba384dbdb89a"

function template_newfundsreq_memo(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions[0].contractAccountName === CONTRACT_ACCOUNT_NAME_NEWFUNDSREQ, InvalidDataReason. ACTION_NOT_SUPPORTED);

    const actionData: ParsedRequestFundsData = tx.actions[0].data as ParsedRequestFundsData;

    //Matching template
    if (actionData.memo.length == 0) {
        return []
    }
    validate(actionData.hash.length == 0, InvalidDataReason.INVALID_HASH)
    validate(actionData.offline_url.length == 0, InvalidDataReason.INVALID_HASH)
    
    return [
        COMMAND_APPEND_CONST_DATA("01" as HexString),
        ...COMMANDS_COUNTED_SECTION([
            COMMAND_APPEND_DATA_STRING_SHOW("Memo", Buffer.from(actionData.memo)),
        ]),
        COMMAND_APPEND_CONST_DATA("01000100" as HexString),
    ]
}

function template_newfundsreq_hash(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions[0].contractAccountName === CONTRACT_ACCOUNT_NAME_NEWFUNDSREQ, InvalidDataReason. ACTION_NOT_SUPPORTED);

    const actionData: ParsedRequestFundsData = tx.actions[0].data as ParsedRequestFundsData;

    //Matching template
    if (actionData.hash.length == 0) {
        return []
    }
    validate(actionData.memo.length == 0, InvalidDataReason.INVALID_MEMO)

    return [
        COMMAND_APPEND_CONST_DATA("010001" as HexString),
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
    validate(tx.actions[0].authorization.length == 1, InvalidDataReason.MULTIPLE_AUTHORIZATION_NOT_SUPPORTED);    

    // Template matching
    if (tx.actions[0].contractAccountName !== CONTRACT_ACCOUNT_NAME_NEWFUNDSREQ) {
        return [];
    }

    const actionData: ParsedRequestFundsData = tx.actions[0].data as ParsedRequestFundsData;
    const authorization: ParsedActionAuthorisation = tx.actions[0].authorization[0];

    const memoAndHash: Array<Command> = templateAlternative([template_newfundsreq_memo, template_newfundsreq_hash])(chainId, tx, parsedPath)
    validate(memoAndHash.length !== 0, InvalidDataReason.INVALID_MEMO)

    return [
        COMMAND_APPEND_CONST_DATA(CONTRACT_ACCOUNT_NAME_NEWFUNDSREQ+"01" as HexString),
        COMMAND_SHOW_MESSAGE("Action", "Request Funds"),
        COMMAND_APPEND_DATA_NAME_SHOW("Authorization actor", authorization.actor), 
        COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW(Buffer.from(authorization.permission, "hex"), 8, 8),
        ...COMMANDS_COUNTED_SECTION([
            ...COMMANDS_COUNTED_SECTION([
                COMMAND_APPEND_DATA_STRING_SHOW("Payer FIO Address", Buffer.from(actionData.payer_fio_address))
            ]), 
            ...COMMANDS_COUNTED_SECTION([
                COMMAND_APPEND_DATA_STRING_SHOW("Payee FIO Address", Buffer.from(actionData.payee_fio_address))
            ]), 
            ...COMMANDS_COUNTED_SECTION([
                ...COMMANDS_DH_ENCODE(actionData.payee_public_key, [
                    ...COMMANDS_COUNTED_SECTION([
                        COMMAND_APPEND_DATA_STRING_SHOW("Payee Public Addr.", Buffer.from(actionData.payee_public_address)),
                    ]),
                    ...COMMANDS_COUNTED_SECTION([
                        COMMAND_APPEND_DATA_STRING_SHOW("Amount requested", Buffer.from(actionData.amount)),
                    ]),
                    ...COMMANDS_COUNTED_SECTION([
                        COMMAND_APPEND_DATA_STRING_SHOW("Chain code", Buffer.from(actionData.chain_code)),
                    ]),
                    ...COMMANDS_COUNTED_SECTION([
                        COMMAND_APPEND_DATA_STRING_SHOW("Token code", Buffer.from(actionData.token_code)),
                    ]),
                    ...memoAndHash,
                ])
            ], 64, 296),
            COMMAND_APPEND_DATA_FIO_AMOUNT_SHOW("Max fee", uint64_to_buf(actionData.max_fee).reverse()),
            ...COMMANDS_COUNTED_SECTION([
                COMMAND_APPEND_DATA_STRING_SHOW("Actor", Buffer.from(actionData.actor))
            ]),
            ...COMMANDS_COUNTED_SECTION([
                COMMAND_APPEND_DATA_STRING_DO_NOT_SHOW(Buffer.from(actionData.tpid), 0, 21),
            ]),
        ]),
    ];
}
