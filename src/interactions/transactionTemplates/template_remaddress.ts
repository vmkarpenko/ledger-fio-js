import type {HexString, ParsedActionAuthorisation, ParsedMapBlockchainPublicAddress, ParsedTransaction, ParsedTransferFIOTokensData, Uint8_t, ValidBIP32Path} from "../../types/internal"
import { Command, VALUE_STORAGE_COMPARE, COMMAND_APPEND_CONST_DATA, COMMAND_SHOW_MESSAGE, COMMANDS_COUNTED_SECTION, COMMAND_STORE_VALUE, 
         COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW, COMMAND_APPEND_DATA_STRING_SHOW, COMMAND_APPEND_DATA_FIO_AMOUNT_SHOW, 
         COMMAND_APPEND_DATA_STRING_DO_NOT_SHOW,
         ADD_STORAGE_CHECK,
         templateAlternative,
         COMMAND_APPEND_DATA_CHAIN_CODE_TOKEN_CODE_PUBLIC_ADDR_SHOW,
         COMMAND_APPEND_DATA_STRING_WITH_LENGTH_SHOW,
         COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW} from "./commands"
import { uint64_to_buf } from "../../utils/serialize"
import { parseNameString, validate } from "../../utils/parse"
import { InvalidDataReason } from "../../errors";

const CONTRACT_ACCOUNT = parseNameString("fio.address", InvalidDataReason.UNEXPECTED_ERROR);
const CONTRACT_NAME = parseNameString("remaddress", InvalidDataReason.UNEXPECTED_ERROR);


function template1(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions[0].account === CONTRACT_ACCOUNT, InvalidDataReason. ACTION_NOT_SUPPORTED);
    validate(tx.actions[0].name === CONTRACT_NAME, InvalidDataReason. ACTION_NOT_SUPPORTED);

    const actionData: ParsedMapBlockchainPublicAddress = tx.actions[0].data as ParsedMapBlockchainPublicAddress;

    //Matching template
    if (actionData.public_addresses.length != 1) {
        return []
    }
    
    return [
        COMMAND_APPEND_CONST_DATA("01" as HexString),
        COMMAND_APPEND_DATA_CHAIN_CODE_TOKEN_CODE_PUBLIC_ADDR_SHOW("Mapping 1", actionData.public_addresses[0].chain_code,
                actionData.public_addresses[0].token_code, actionData.public_addresses[0].public_address),
    ]
}

function template2(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions[0].account === CONTRACT_ACCOUNT, InvalidDataReason. ACTION_NOT_SUPPORTED);
    validate(tx.actions[0].name === CONTRACT_NAME, InvalidDataReason. ACTION_NOT_SUPPORTED);

    const actionData: ParsedMapBlockchainPublicAddress = tx.actions[0].data as ParsedMapBlockchainPublicAddress;

    //Matching template
    if (actionData.public_addresses.length != 2) {
        return []
    }
    
    return [
        COMMAND_APPEND_CONST_DATA("02" as HexString),
        COMMAND_APPEND_DATA_CHAIN_CODE_TOKEN_CODE_PUBLIC_ADDR_SHOW("Mapping 1", actionData.public_addresses[0].chain_code,
                actionData.public_addresses[0].token_code, actionData.public_addresses[0].public_address),
        COMMAND_APPEND_DATA_CHAIN_CODE_TOKEN_CODE_PUBLIC_ADDR_SHOW("Mapping 2", actionData.public_addresses[1].chain_code,
                actionData.public_addresses[1].token_code, actionData.public_addresses[1].public_address),
    ]
}

function template3(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions[0].account === CONTRACT_ACCOUNT, InvalidDataReason. ACTION_NOT_SUPPORTED);
    validate(tx.actions[0].name === CONTRACT_NAME, InvalidDataReason. ACTION_NOT_SUPPORTED);

    const actionData: ParsedMapBlockchainPublicAddress = tx.actions[0].data as ParsedMapBlockchainPublicAddress;

    //Matching template
    if (actionData.public_addresses.length != 3) {
        return []
    }
    
    return [
        COMMAND_APPEND_CONST_DATA("03" as HexString),
        COMMAND_APPEND_DATA_CHAIN_CODE_TOKEN_CODE_PUBLIC_ADDR_SHOW("Mapping 1", actionData.public_addresses[0].chain_code,
                actionData.public_addresses[0].token_code, actionData.public_addresses[0].public_address),
        COMMAND_APPEND_DATA_CHAIN_CODE_TOKEN_CODE_PUBLIC_ADDR_SHOW("Mapping 2", actionData.public_addresses[1].chain_code,
                actionData.public_addresses[1].token_code, actionData.public_addresses[1].public_address),
        COMMAND_APPEND_DATA_CHAIN_CODE_TOKEN_CODE_PUBLIC_ADDR_SHOW("Mapping 3", actionData.public_addresses[2].chain_code,
                actionData.public_addresses[2].token_code, actionData.public_addresses[2].public_address),
    ]
}

function template4(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions[0].account === CONTRACT_ACCOUNT, InvalidDataReason. ACTION_NOT_SUPPORTED);
    validate(tx.actions[0].name === CONTRACT_NAME, InvalidDataReason. ACTION_NOT_SUPPORTED);

    const actionData: ParsedMapBlockchainPublicAddress = tx.actions[0].data as ParsedMapBlockchainPublicAddress;

    //Matching template
    if (actionData.public_addresses.length != 4) {
        return []
    }
    
    return [
        COMMAND_APPEND_CONST_DATA("04" as HexString),
        COMMAND_APPEND_DATA_CHAIN_CODE_TOKEN_CODE_PUBLIC_ADDR_SHOW("Mapping 1", actionData.public_addresses[0].chain_code,
                actionData.public_addresses[0].token_code, actionData.public_addresses[0].public_address),
        COMMAND_APPEND_DATA_CHAIN_CODE_TOKEN_CODE_PUBLIC_ADDR_SHOW("Mapping 2", actionData.public_addresses[1].chain_code,
                actionData.public_addresses[1].token_code, actionData.public_addresses[1].public_address),
        COMMAND_APPEND_DATA_CHAIN_CODE_TOKEN_CODE_PUBLIC_ADDR_SHOW("Mapping 3", actionData.public_addresses[2].chain_code,
                actionData.public_addresses[2].token_code, actionData.public_addresses[2].public_address),
        COMMAND_APPEND_DATA_CHAIN_CODE_TOKEN_CODE_PUBLIC_ADDR_SHOW("Mapping 4", actionData.public_addresses[3].chain_code,
                actionData.public_addresses[3].token_code, actionData.public_addresses[3].public_address),
    ]
}


function template5(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions[0].account === CONTRACT_ACCOUNT, InvalidDataReason. ACTION_NOT_SUPPORTED);
    validate(tx.actions[0].name === CONTRACT_NAME, InvalidDataReason. ACTION_NOT_SUPPORTED);

    const actionData: ParsedMapBlockchainPublicAddress = tx.actions[0].data as ParsedMapBlockchainPublicAddress;

    //Matching template
    if (actionData.public_addresses.length != 5) {
        return []
    }
    
    return [
        COMMAND_APPEND_CONST_DATA("05" as HexString),
        COMMAND_APPEND_DATA_CHAIN_CODE_TOKEN_CODE_PUBLIC_ADDR_SHOW("Mapping 1", actionData.public_addresses[0].chain_code,
                actionData.public_addresses[0].token_code, actionData.public_addresses[0].public_address),
        COMMAND_APPEND_DATA_CHAIN_CODE_TOKEN_CODE_PUBLIC_ADDR_SHOW("Mapping 2", actionData.public_addresses[1].chain_code,
                actionData.public_addresses[1].token_code, actionData.public_addresses[1].public_address),
        COMMAND_APPEND_DATA_CHAIN_CODE_TOKEN_CODE_PUBLIC_ADDR_SHOW("Mapping 3", actionData.public_addresses[2].chain_code,
                actionData.public_addresses[2].token_code, actionData.public_addresses[2].public_address),
        COMMAND_APPEND_DATA_CHAIN_CODE_TOKEN_CODE_PUBLIC_ADDR_SHOW("Mapping 4", actionData.public_addresses[3].chain_code,
                actionData.public_addresses[3].token_code, actionData.public_addresses[3].public_address),
        COMMAND_APPEND_DATA_CHAIN_CODE_TOKEN_CODE_PUBLIC_ADDR_SHOW("Mapping 5", actionData.public_addresses[4].chain_code,
                actionData.public_addresses[4].token_code, actionData.public_addresses[4].public_address),
    ]
}

export function template_remaddress(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    //Validate template expectations
    validate(tx.context_free_actions.length == 0, InvalidDataReason.CONTEXT_FREE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions[0].authorization.length == 1, InvalidDataReason.MULTIPLE_AUTHORIZATION_NOT_SUPPORTED);    

    // Template matching
    if (tx.actions[0].account !== CONTRACT_ACCOUNT || tx.actions[0].name !== CONTRACT_NAME) {
        return [];
    }

    const actionData: ParsedMapBlockchainPublicAddress = tx.actions[0].data as ParsedMapBlockchainPublicAddress;
    const authorization: ParsedActionAuthorisation = tx.actions[0].authorization[0];
    
    const addressesCommands: Array<Command> = templateAlternative([template1, template2, template3, template4, template5])(chainId, tx, parsedPath)
    validate(addressesCommands.length !== 0, InvalidDataReason.INCORRECT_NUMBER_OF_PUBLIC_ADDRESSES)

    return [
        COMMAND_APPEND_CONST_DATA(tx.actions[0].account+tx.actions[0].name+"01" as HexString),
        COMMAND_SHOW_MESSAGE("Action", "Remove public address mappings"),
        COMMAND_STORE_VALUE(1 as Uint8_t, Buffer.from(tx.actions[0].authorization[0].actor, "hex")),
        ADD_STORAGE_CHECK(VALUE_STORAGE_COMPARE.COMPARE_REGISTER1, 
            COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW(Buffer.from(authorization.actor, "hex"), 8, 8)),
        COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW(Buffer.from(authorization.permission, "hex"), 8, 8),
        ...COMMANDS_COUNTED_SECTION([
            COMMAND_APPEND_DATA_STRING_WITH_LENGTH_SHOW("FIO Cr. Handle", Buffer.from(actionData.fio_address), 3, 64),
            ...addressesCommands,
            COMMAND_APPEND_DATA_FIO_AMOUNT_SHOW("Max fee", uint64_to_buf(actionData.max_fee).reverse()), 
            ADD_STORAGE_CHECK(VALUE_STORAGE_COMPARE.COMPARE_REGISTER1, 
                COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW(Buffer.from(actionData.actor, "hex"), 8, 8)),
            COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW(Buffer.from(actionData.tpid)),
        ]),
    ];
}
