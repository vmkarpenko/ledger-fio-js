import type {HexString, ParsedActionAuthorisation, ParsedMapBlockchainPublicAddress, ParsedStakeFIO, ParsedTransaction, ParsedTransferFIOTokensData, ParsedVoteOnBlockProducers, Uint8_t, ValidBIP32Path} from "../../types/internal"
import { Command, VALUE_STORAGE_COMPARE, COMMAND_APPEND_CONST_DATA, COMMAND_SHOW_MESSAGE, COMMANDS_COUNTED_SECTION, COMMAND_STORE_VALUE, 
         COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW, COMMAND_APPEND_DATA_STRING_SHOW, COMMAND_APPEND_DATA_FIO_AMOUNT_SHOW, 
         COMMAND_APPEND_DATA_STRING_DO_NOT_SHOW,
         ADD_STORAGE_CHECK, 
         templateAlternative} from "./commands"
import { uint64_to_buf } from "../../utils/serialize"
import { parseNameString, validate } from "../../utils/parse"
import { InvalidDataReason } from "../../errors";

const CONTRACT_ACCOUNT = parseNameString("eosio", InvalidDataReason.UNEXPECTED_ERROR);
const CONTRACT_NAME = parseNameString("voteproducer", InvalidDataReason.UNEXPECTED_ERROR);

function template1(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);

    const actionData: ParsedVoteOnBlockProducers = tx.actions[0].data as ParsedVoteOnBlockProducers;

    //Matching template
    if (actionData.producers.length != 1) {
        return []
    }
    
    return [
        COMMAND_APPEND_CONST_DATA("01" as HexString),
        ...COMMANDS_COUNTED_SECTION([
            COMMAND_APPEND_DATA_STRING_SHOW("Producer 1", Buffer.from(actionData.producers[0]), 3, 64)
        ]), 
    ]
}

function template2(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);

    const actionData: ParsedVoteOnBlockProducers = tx.actions[0].data as ParsedVoteOnBlockProducers;

    //Matching template
    if (actionData.producers.length != 2) {
        return []
    }
    
    return [
        COMMAND_APPEND_CONST_DATA("02" as HexString),
        ...COMMANDS_COUNTED_SECTION([
            COMMAND_APPEND_DATA_STRING_SHOW("Producer 1", Buffer.from(actionData.producers[0]), 3, 64)
        ]), 
        ...COMMANDS_COUNTED_SECTION([
            COMMAND_APPEND_DATA_STRING_SHOW("Producer 2", Buffer.from(actionData.producers[1]), 3, 64)
        ]), 
    ]
}

function template3(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);

    const actionData: ParsedVoteOnBlockProducers = tx.actions[0].data as ParsedVoteOnBlockProducers;

    //Matching template
    if (actionData.producers.length != 3) {
        return []
    }
    
    return [
        COMMAND_APPEND_CONST_DATA("03" as HexString),
        ...COMMANDS_COUNTED_SECTION([
            COMMAND_APPEND_DATA_STRING_SHOW("Producer 1", Buffer.from(actionData.producers[0]), 3, 64)
        ]), 
        ...COMMANDS_COUNTED_SECTION([
            COMMAND_APPEND_DATA_STRING_SHOW("Producer 2", Buffer.from(actionData.producers[1]), 3, 64)
        ]), 
        ...COMMANDS_COUNTED_SECTION([
            COMMAND_APPEND_DATA_STRING_SHOW("Producer 3", Buffer.from(actionData.producers[2]), 3, 64)
        ]), 
    ]
}

function template4(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);

    const actionData: ParsedVoteOnBlockProducers = tx.actions[3].data as ParsedVoteOnBlockProducers;

    //Matching template
    if (actionData.producers.length != 4) {
        return []
    }
    
    return [
        COMMAND_APPEND_CONST_DATA("04" as HexString),
        ...COMMANDS_COUNTED_SECTION([
            COMMAND_APPEND_DATA_STRING_SHOW("Producer 1", Buffer.from(actionData.producers[0]), 3, 64)
        ]), 
        ...COMMANDS_COUNTED_SECTION([
            COMMAND_APPEND_DATA_STRING_SHOW("Producer 2", Buffer.from(actionData.producers[1]), 3, 64)
        ]), 
        ...COMMANDS_COUNTED_SECTION([
            COMMAND_APPEND_DATA_STRING_SHOW("Producer 3", Buffer.from(actionData.producers[2]), 3, 64)
        ]), 
        ...COMMANDS_COUNTED_SECTION([
            COMMAND_APPEND_DATA_STRING_SHOW("Producer 4", Buffer.from(actionData.producers[3]), 3, 64)
        ]), 
    ]
}

function template5(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);

    const actionData: ParsedVoteOnBlockProducers = tx.actions[0].data as ParsedVoteOnBlockProducers;

    //Matching template
    if (actionData.producers.length != 5) {
        return []
    }
    
    return [
        COMMAND_APPEND_CONST_DATA("05" as HexString),
        ...COMMANDS_COUNTED_SECTION([
            COMMAND_APPEND_DATA_STRING_SHOW("Producer 1", Buffer.from(actionData.producers[0]), 3, 64)
        ]), 
        ...COMMANDS_COUNTED_SECTION([
            COMMAND_APPEND_DATA_STRING_SHOW("Producer 2", Buffer.from(actionData.producers[1]), 3, 64)
        ]), 
        ...COMMANDS_COUNTED_SECTION([
            COMMAND_APPEND_DATA_STRING_SHOW("Producer 3", Buffer.from(actionData.producers[2]), 3, 64)
        ]), 
        ...COMMANDS_COUNTED_SECTION([
            COMMAND_APPEND_DATA_STRING_SHOW("Producer 4", Buffer.from(actionData.producers[3]), 3, 64)
        ]), 
        ...COMMANDS_COUNTED_SECTION([
            COMMAND_APPEND_DATA_STRING_SHOW("Producer 5", Buffer.from(actionData.producers[4]), 3, 64)
        ]), 
    ]
}

export function template_voteproducer(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    //Validate template expectations
    validate(tx.context_free_actions.length == 0, InvalidDataReason.CONTEXT_FREE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions[0].authorization.length == 1, InvalidDataReason.MULTIPLE_AUTHORIZATION_NOT_SUPPORTED);    

    // Template matching
    if (tx.actions[0].account !== CONTRACT_ACCOUNT || tx.actions[0].name !== CONTRACT_NAME) {
        return [];
    }

    const actionData: ParsedVoteOnBlockProducers = tx.actions[0].data as ParsedVoteOnBlockProducers;
    const authorization: ParsedActionAuthorisation = tx.actions[0].authorization[0];

    const producerCommands: Array<Command> = templateAlternative([template1, template2, template3, template4, template5])(chainId, tx, parsedPath)
    validate(producerCommands.length !== 0, InvalidDataReason.INCORRECT_NUMBER_OF_PUBLIC_ADDRESSES)

    return [
        COMMAND_APPEND_CONST_DATA(tx.actions[0].account+tx.actions[0].name+"01" as HexString),
        COMMAND_SHOW_MESSAGE("Action", "Stake FIO Tokens"),
        COMMAND_STORE_VALUE(1 as Uint8_t, Buffer.from(tx.actions[0].authorization[0].actor, "hex")),
        ADD_STORAGE_CHECK(VALUE_STORAGE_COMPARE.COMPARE_REGISTER1, 
            COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW(Buffer.from(authorization.actor, "hex"), 8, 8)),
        COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW(Buffer.from(authorization.permission, "hex"), 8, 8),
        ...COMMANDS_COUNTED_SECTION([
            ...producerCommands,
            ...COMMANDS_COUNTED_SECTION([
                COMMAND_APPEND_DATA_STRING_SHOW("FIO Crypto Handle", Buffer.from(actionData.fio_address), 3, 64)
            ]), 
            ADD_STORAGE_CHECK(VALUE_STORAGE_COMPARE.COMPARE_REGISTER1, 
                COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW(Buffer.from(actionData.actor, "hex"), 8, 8)),
            COMMAND_APPEND_DATA_FIO_AMOUNT_SHOW("Max fee", uint64_to_buf(actionData.max_fee).reverse()), 
        ]),
    ];
}
