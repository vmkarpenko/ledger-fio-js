import type {HexString, ParsedActionAuthorisation, ParsedMapBlockchainPublicAddress, ParsedStakeFIO, ParsedTransaction, ParsedTransferFIOTokensData, ParsedVoteOnBlockProducers, Uint8_t, ValidBIP32Path} from "../../types/internal"
import { Command, VALUE_STORAGE_COMPARE, COMMAND_APPEND_CONST_DATA, COMMAND_SHOW_MESSAGE, COMMANDS_COUNTED_SECTION, COMMAND_STORE_VALUE, 
         COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW, COMMAND_APPEND_DATA_STRING_SHOW, COMMAND_APPEND_DATA_FIO_AMOUNT_SHOW, 
         COMMAND_APPEND_DATA_STRING_DO_NOT_SHOW,
         ADD_STORAGE_CHECK, 
         templateAlternative,
         COMMAND_APPEND_DATA_STRING_WITH_LENGTH_SHOW} from "./commands"
import { uint64_to_buf, uint8_to_buf } from "../../utils/serialize"
import { parseNameString, validate } from "../../utils/parse"
import { InvalidDataReason } from "../../errors";

const CONTRACT_ACCOUNT = parseNameString("eosio", InvalidDataReason.UNEXPECTED_ERROR);
const CONTRACT_NAME = parseNameString("voteproducer", InvalidDataReason.UNEXPECTED_ERROR);

function template_n(n: number) {
    return (chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> => {
        validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);
        const actionData: ParsedVoteOnBlockProducers = tx.actions[0].data as ParsedVoteOnBlockProducers;

        //Matching template
        if (actionData.producers.length != n) {
            return []
        }
        
        return [
            COMMAND_APPEND_CONST_DATA(uint8_to_buf(n as Uint8_t).toString("hex") as HexString),
            ... [...Array(n).keys()].map(
                k => COMMAND_APPEND_DATA_STRING_WITH_LENGTH_SHOW("Producer " + (k+1), Buffer.from(actionData.producers[k]), 3, 64)
            ) 
        ]
    }
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

    const producerCommands: Array<Command> = templateAlternative(
                [...Array(actionData.producers.length).keys()].map(k=>template_n(k+1))
            )(chainId, tx, parsedPath)
    validate(producerCommands.length !== 0, InvalidDataReason.INCORRECT_NUMBER_OF_PRODUCERS)

    return [
        COMMAND_APPEND_CONST_DATA(tx.actions[0].account+tx.actions[0].name+"01" as HexString),
        COMMAND_SHOW_MESSAGE("Action", "Vote for FIO Block producers"),
        COMMAND_STORE_VALUE(1 as Uint8_t, Buffer.from(tx.actions[0].authorization[0].actor, "hex")),
        ADD_STORAGE_CHECK(VALUE_STORAGE_COMPARE.COMPARE_REGISTER1, 
            COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW(Buffer.from(authorization.actor, "hex"), 8, 8)),
        COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW(Buffer.from(authorization.permission, "hex"), 8, 8),
        ...COMMANDS_COUNTED_SECTION([
            ...producerCommands,
            COMMAND_APPEND_DATA_STRING_WITH_LENGTH_SHOW("FIO Cr. Handle", Buffer.from(actionData.fio_address), 3, 64),
            ADD_STORAGE_CHECK(VALUE_STORAGE_COMPARE.COMPARE_REGISTER1, 
                COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW(Buffer.from(actionData.actor, "hex"), 8, 8)),
            COMMAND_APPEND_DATA_FIO_AMOUNT_SHOW("Max fee", uint64_to_buf(actionData.max_fee).reverse()), 
        ]),
    ];
}
