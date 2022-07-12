import type {HexString, ParsedActionAuthorisation, ParsedMapBlockchainPublicAddress, ParsedMapNFTSignature, ParsedNFT, ParsedTransaction, ParsedTransferFIOTokensData, Uint8_t, ValidBIP32Path} from "../../types/internal"
import { Command, VALUE_STORAGE_COMPARE, COMMAND_APPEND_CONST_DATA, COMMAND_SHOW_MESSAGE, COMMANDS_COUNTED_SECTION, COMMAND_STORE_VALUE, 
         COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW, COMMAND_APPEND_DATA_STRING_SHOW, COMMAND_APPEND_DATA_FIO_AMOUNT_SHOW, 
         COMMAND_APPEND_DATA_STRING_DO_NOT_SHOW,
         ADD_STORAGE_CHECK,
         templateAlternative,
         COMMAND_APPEND_DATA_CHAIN_CODE_TOKEN_CODE_PUBLIC_ADDR_SHOW,
         COMMAND_APPEND_DATA_CHAIN_CODE_CONTRACT_ADDR_TOKEN_TD_SHOW,
         COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW,
         COMMAND_APPEND_DATA_STRING_WITH_LENGTH_SHOW} from "./commands"
import { uint64_to_buf } from "../../utils/serialize"
import { parseNameString, validate } from "../../utils/parse"
import { InvalidDataReason } from "../../errors";

const CONTRACT_ACCOUNT = parseNameString("fio.address", InvalidDataReason.UNEXPECTED_ERROR);
const CONTRACT_NAME = parseNameString("addnft", InvalidDataReason.UNEXPECTED_ERROR);


function template1(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions[0].account === CONTRACT_ACCOUNT, InvalidDataReason. ACTION_NOT_SUPPORTED);
    validate(tx.actions[0].name === CONTRACT_NAME, InvalidDataReason. ACTION_NOT_SUPPORTED);

    const actionData: ParsedMapNFTSignature = tx.actions[0].data as ParsedMapNFTSignature;

    //Matching template
    if (actionData.nfts.length != 1) {
        return []
    }
    
    return [
        COMMAND_APPEND_CONST_DATA("01" as HexString),
        COMMAND_APPEND_DATA_CHAIN_CODE_CONTRACT_ADDR_TOKEN_TD_SHOW("Mapping 1", actionData.nfts[0].chain_code,
                actionData.nfts[0].contract_address, actionData.nfts[0].token_id),
        COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW(Buffer.from(actionData.nfts[0].url), 0, 128),
        COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW(Buffer.from(actionData.nfts[0].hash), 1, 64),
        COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW(Buffer.from(actionData.nfts[0].metadata), 0, 128),
    ]
}

function template2(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions[0].account === CONTRACT_ACCOUNT, InvalidDataReason. ACTION_NOT_SUPPORTED);
    validate(tx.actions[0].name === CONTRACT_NAME, InvalidDataReason. ACTION_NOT_SUPPORTED);

    const actionData: ParsedMapNFTSignature = tx.actions[0].data as ParsedMapNFTSignature;

    //Matching template
    if (actionData.nfts.length != 2) {
        return []
    }
    
    return [
        COMMAND_APPEND_CONST_DATA("02" as HexString),
        COMMAND_APPEND_DATA_CHAIN_CODE_CONTRACT_ADDR_TOKEN_TD_SHOW("Mapping 1", actionData.nfts[0].chain_code,
                actionData.nfts[0].contract_address, actionData.nfts[0].token_id),
        COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW(Buffer.from(actionData.nfts[0].url), 0, 128),
        COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW(Buffer.from(actionData.nfts[0].hash), 1, 64),
        COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW(Buffer.from(actionData.nfts[0].metadata), 0, 128),
        COMMAND_APPEND_DATA_CHAIN_CODE_CONTRACT_ADDR_TOKEN_TD_SHOW("Mapping 2", actionData.nfts[1].chain_code,
                actionData.nfts[1].contract_address, actionData.nfts[1].token_id),
        COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW(Buffer.from(actionData.nfts[1].url), 0, 128),
        COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW(Buffer.from(actionData.nfts[1].hash), 1, 64),
        COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW(Buffer.from(actionData.nfts[1].metadata), 0, 128),
    ]
}

function template3(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions[0].account === CONTRACT_ACCOUNT, InvalidDataReason. ACTION_NOT_SUPPORTED);
    validate(tx.actions[0].name === CONTRACT_NAME, InvalidDataReason. ACTION_NOT_SUPPORTED);

    const actionData: ParsedMapNFTSignature = tx.actions[0].data as ParsedMapNFTSignature;

    //Matching template
    if (actionData.nfts.length != 3) {
        return []
    }
    
    return [
        COMMAND_APPEND_CONST_DATA("03" as HexString),
        COMMAND_APPEND_DATA_CHAIN_CODE_CONTRACT_ADDR_TOKEN_TD_SHOW("Mapping 1", actionData.nfts[0].chain_code,
                actionData.nfts[0].contract_address, actionData.nfts[0].token_id),
        COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW(Buffer.from(actionData.nfts[0].url), 0, 128),
        COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW(Buffer.from(actionData.nfts[0].hash), 1, 64),
        COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW(Buffer.from(actionData.nfts[0].metadata), 0, 128),
        COMMAND_APPEND_DATA_CHAIN_CODE_CONTRACT_ADDR_TOKEN_TD_SHOW("Mapping 2", actionData.nfts[1].chain_code,
                actionData.nfts[1].contract_address, actionData.nfts[1].token_id),
        COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW(Buffer.from(actionData.nfts[1].url), 0, 128),
        COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW(Buffer.from(actionData.nfts[1].hash), 1, 64),
        COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW(Buffer.from(actionData.nfts[1].metadata), 0, 128),
        COMMAND_APPEND_DATA_CHAIN_CODE_CONTRACT_ADDR_TOKEN_TD_SHOW("Mapping 3", actionData.nfts[2].chain_code,
                actionData.nfts[2].contract_address, actionData.nfts[2].token_id),
        COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW(Buffer.from(actionData.nfts[2].url), 0, 128),
        COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW(Buffer.from(actionData.nfts[2].hash), 1, 64),
        COMMAND_APPEND_DATA_STRING_WITH_LENGTH_DO_NOT_SHOW(Buffer.from(actionData.nfts[2].metadata), 0, 128),
    ]
}

export function template_addnft(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    //Validate template expectations
    validate(tx.context_free_actions.length == 0, InvalidDataReason.CONTEXT_FREE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions[0].authorization.length == 1, InvalidDataReason.MULTIPLE_AUTHORIZATION_NOT_SUPPORTED);    

    // Template matching
    if (tx.actions[0].account !== CONTRACT_ACCOUNT || tx.actions[0].name !== CONTRACT_NAME) {
        return [];
    }

    const actionData: ParsedMapNFTSignature = tx.actions[0].data as ParsedMapNFTSignature;
    const authorization: ParsedActionAuthorisation = tx.actions[0].authorization[0];
    
    const addressesCommands: Array<Command> = templateAlternative([template1, template2, template3])(chainId, tx, parsedPath)
    validate(addressesCommands.length !== 0, InvalidDataReason.INCORRECT_NUMBER_OF_PUBLIC_ADDRESSES)

    return [
        COMMAND_APPEND_CONST_DATA(tx.actions[0].account+tx.actions[0].name+"01" as HexString),
        COMMAND_SHOW_MESSAGE("Action", "Map nfts"),
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
