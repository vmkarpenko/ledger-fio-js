import type {HexString, ParsedTransaction, Uint8_t, ValidBIP32Path} from "../../types/internal"
import { COMMAND, Command, constDataAppendData, constDataShowMessage, constDataStartCountedSection, getCommandVarLength,
         VALUE_FORMAT, VALUE_VALIDATION, VALUE_POLICY, VALUE_STORAGE_COMPARE, defaultCommand } from "./commands"
import { buf_to_hex, date_to_buf, path_to_buf, uint16_to_buf, uint32_to_buf, uint64_to_buf, varuint32_to_buf } from "../../utils/serialize"
import { validate } from "../../utils/parse"
import { InvalidDataReason } from "../../errors";
import { assert } from "../../utils/assert"
import { chunkBy } from "../../utils/ioHelpers"


export function templete_trnsfiopubky(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    //Validate template expectations
    validate(tx.actions[0].contractAccountName === "0000980ad20ca85be0e1d195ba85e7cd", InvalidDataReason.ACTION_NOT_SUPPORTED);

    validate(tx.context_free_actions.length == 0, InvalidDataReason.CONTEXT_FREE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions[0].authorization.length == 1, InvalidDataReason.MULTIPLE_AUTHORIZATION_NOT_SUPPORTED);


    const tpidCommands: Array<Command> = [
        {
            //tpid
            ...defaultCommand,
            command: COMMAND.APPEND_DATA, 
            constData: constDataAppendData(
                VALUE_FORMAT.VALUE_FORMAT_ASCII_STRING,
                VALUE_VALIDATION.VALUE_VALIDATION_INBUFFER_LENGTH, BigInt(0), BigInt(21), //21 max tipd length
                VALUE_POLICY.VALUE_DO_NOT_SHOW_ON_DEVICE,
                VALUE_STORAGE_COMPARE.DO_NOT_COMPARE,
                "Tpid"
            ),
            varData: Buffer.from(tx.actions[0].data.tpid),
        },
    ];

    const payeePublicKeyCommands: Array<Command> = [
        {
            //payee pubkey
            ...defaultCommand,
            command: COMMAND.APPEND_DATA, 
            constData: constDataAppendData(
                VALUE_FORMAT.VALUE_FORMAT_ASCII_STRING,
                VALUE_VALIDATION.VALUE_VALIDATION_INBUFFER_LENGTH, BigInt(0), BigInt(55), //55 max WIF pubkey length
                VALUE_POLICY.VALUE_SHOW_ON_DEVICE,
                VALUE_STORAGE_COMPARE.DO_NOT_COMPARE,
                "Payee Pubkey"
            ),
            varData: Buffer.from(tx.actions[0].data.payee_public_key),
        },    
    ];

    const actionDataCommands: Array<Command> = [
        {
            // Payee pubkey length
            ...defaultCommand,
            command: COMMAND.START_COUNTED_SECTION, 
            constData: constDataStartCountedSection(
                VALUE_FORMAT.VALUE_FORMAT_VARUINT32,
                VALUE_VALIDATION.VALUE_VALIDATION_NUMBER, BigInt(0), BigInt(55),
            ),
            varData: varuint32_to_buf(getCommandVarLength(payeePublicKeyCommands)),
        },
        ...payeePublicKeyCommands,
        {
            ...defaultCommand,
            command: COMMAND.END_COUNTED_SECTION, 
        },
        {
            ...defaultCommand,
            command: COMMAND.APPEND_DATA, 
            constData: constDataAppendData(
                VALUE_FORMAT.VALUE_FORMAT_FIO_AMOUNT,
                VALUE_VALIDATION.VALUE_VALIDATION_NONE, BigInt(0), BigInt(0),
                VALUE_POLICY.VALUE_SHOW_ON_DEVICE,
                VALUE_STORAGE_COMPARE.DO_NOT_COMPARE,
                "Amount"
            ),
            varData: uint64_to_buf(tx.actions[0].data.amount).reverse(),
        },
        {
            ...defaultCommand,
            command: COMMAND.APPEND_DATA, 
            constData: constDataAppendData(
                VALUE_FORMAT.VALUE_FORMAT_FIO_AMOUNT,
                VALUE_VALIDATION.VALUE_VALIDATION_NONE, BigInt(0), BigInt(0),
                VALUE_POLICY.VALUE_SHOW_ON_DEVICE,
                VALUE_STORAGE_COMPARE.DO_NOT_COMPARE,
                "Max fee"
            ),
            varData: uint64_to_buf(tx.actions[0].data.max_fee).reverse(),
        },
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
            varData: Buffer.from(tx.actions[0].data.actor, "hex")
        },
        {
            ...defaultCommand,
            command: COMMAND.START_COUNTED_SECTION, 
            constData: constDataStartCountedSection(
                VALUE_FORMAT.VALUE_FORMAT_VARUINT32,
                VALUE_VALIDATION.VALUE_VALIDATION_NONE, BigInt(0), BigInt(0),
            ),
            varData: varuint32_to_buf(getCommandVarLength(tpidCommands)),
        },
        ...tpidCommands,
        {
            ...defaultCommand,
            command: COMMAND.END_COUNTED_SECTION, 
        },
    ];


    return [
        {
            //chainId
            ...defaultCommand,
            command: COMMAND.INIT, 
            varData: Buffer.concat([Buffer.from(chainId, "hex"), path_to_buf(parsedPath)]),
        },
        {
            //expiration, ref_block_num, ref_block_prefix
            ...defaultCommand,
            command: COMMAND.APPEND_DATA, 
            constData: constDataAppendData(
                VALUE_FORMAT.VALUE_FORMAT_BUFFER_SHOW_AS_HEX,
                VALUE_VALIDATION.VALUE_VALIDATION_INBUFFER_LENGTH, BigInt(10), BigInt(10),
                VALUE_POLICY.VALUE_DO_NOT_SHOW_ON_DEVICE,
                VALUE_STORAGE_COMPARE.DO_NOT_COMPARE,
                ""
            ),
            varData: Buffer.concat([
                date_to_buf(tx.expiration).reverse(), 
                uint16_to_buf(tx.ref_block_num).reverse(),
                uint32_to_buf(tx.ref_block_prefix).reverse()
            ]),
        },
        {
            // max_net_usage_words, max_cpu_usage_ms, delay_sec, number_context_free_actions, 
            // number_actions, contractAccountName (for trnsfiopubky actions = 0000980ad20ca85be0e1d195ba85e7cd)
            // Number of actions, 
            ...defaultCommand,
            command: COMMAND.APPEND_CONST_DATA, 
            constData: "00000000010000980ad20ca85be0e1d195ba85e7cd01" as HexString,
        },
        {
            // Show Action name screen,
            ...defaultCommand,
            command: COMMAND.SHOW_MESSAGE, 
            constData: constDataShowMessage(
                "Action",
                "Transfer FIO tokens"
            ),
        },
        {
            // Store authorisation actor as it needs to match action data actor
            ...defaultCommand,
            command: COMMAND.STORE_VALUE, 
            p2: 1 as Uint8_t, 
            varData: Buffer.from(tx.actions[0].authorization[0].actor, "hex"),
        },
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
            varData: Buffer.from(tx.actions[0].authorization[0].actor, "hex")
        },
        {
            // Permission,
            ...defaultCommand,
            command: COMMAND.APPEND_DATA, 
            constData: constDataAppendData(
                VALUE_FORMAT.VALUE_FORMAT_NAME,
                VALUE_VALIDATION.VALUE_VALIDATION_NONE, BigInt(0), BigInt(0),
                VALUE_POLICY.VALUE_DO_NOT_SHOW_ON_DEVICE,
                VALUE_STORAGE_COMPARE.DO_NOT_COMPARE,
                ""
            ),
            varData: Buffer.from(tx.actions[0].authorization[0].permission, "hex"),
        },
        {
            // Action data.length
            ...defaultCommand,
            command: COMMAND.START_COUNTED_SECTION, 
            constData: constDataStartCountedSection(
                VALUE_FORMAT.VALUE_FORMAT_VARUINT32,
                VALUE_VALIDATION.VALUE_VALIDATION_NONE, BigInt(0), BigInt(0),
            ),
            varData: varuint32_to_buf(getCommandVarLength(actionDataCommands)),
        },
        ...actionDataCommands, 
        {
            ...defaultCommand,
            command: COMMAND.END_COUNTED_SECTION, 
        },
        {
            ...defaultCommand,
            command: COMMAND.APPEND_CONST_DATA, 
            constData: "000000000000000000000000000000000000000000000000000000000000000000" as HexString,
        },
        {
            ...defaultCommand,
            command: COMMAND.FINISH, 
            expectedResponseLength: 65 + 32,
            dataAction: (b, s) => {
                const [witnessSignature, hash, rest] = chunkBy(b, [65, 32])
                assert(rest.length === 0, "invalid response length")
            
                return {
                    txHashHex: buf_to_hex(hash),
                    witness: {
                        path: parsedPath,
                        witnessSignatureHex: buf_to_hex(witnessSignature),
                    },
                }
            
            },
        },
    ];
}
