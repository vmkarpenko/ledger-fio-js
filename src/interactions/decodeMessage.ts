import { validate } from "utils/parse"
import { DeviceStatusError, DeviceStatusCodes } from "../errors"
import type {DecodeMessageResponse} from "../fio"
import type {HexString, ParsedContext, ValidBIP32Path} from "../types/internal"
import {PUBLIC_KEY_LENGTH} from "../types/internal"
import type {Version} from "../types/public"
import {assert} from "../utils/assert"
import {chunkBy} from "../utils/ioHelpers"
import {path_to_buf} from "../utils/serialize"
import {INS} from "./common/ins"
import type {Interaction, SendParams} from "./common/types"
import {ensureLedgerAppVersionCompatible} from "./getVersion"

const send = (params: {
    p1: number,
    p2: number,
    data: Buffer,
    expectedResponseLength?: number
}): SendParams => ({ins: INS.DECODE_MESSAGE, ...params})

const enum P1 {
    SEND_DATA = 0x01,
    DECODE = 0x02,
    RECEIVE_REST = 0x03,
}

const enum P2 {
    UNUSED = 0x00,
}

export function* decodeMessage(
    version: Version,
    path: ValidBIP32Path,
    pubkey: HexString,
    message: HexString,
    context: ParsedContext
): Interaction<DecodeMessageResponse> {
    ensureLedgerAppVersionCompatible(version)

    const toSend = Buffer.from(message, "hex");
    const firstChunkLength = 200;
    //We start sending message
    yield send({
        p1: P1.SEND_DATA,
        p2: P2.UNUSED,
        data: toSend.slice(0, firstChunkLength),
        expectedResponseLength: 0,
    })
    if (toSend.slice(firstChunkLength).length != 0) {
        yield send({
            p1: P1.SEND_DATA,
            p2: P2.UNUSED,
            data: toSend.slice(firstChunkLength),
            expectedResponseLength: 0,
        })    
    }
    

    //decode data
    const pathData = path_to_buf(path)
    yield send({
        p1: P1.DECODE,
        p2: context,
        data: Buffer.from(pubkey+pathData.toString("hex"), "hex"),
    })
    
    //get the data
    const response = yield send({
        p1: P1.RECEIVE_REST,
        p2: P2.UNUSED,
        data: Buffer.from(""),
    })
    const [msgLen, chunkLen, decoded] = chunkBy(response, [2, 1])

    //we may need more than one apdu to retrieve data
    let msg = decoded
    let totalLen = msgLen.readUInt16LE()
    let len = chunkLen.readUInt8()

    while(len < totalLen) {
        const response = yield send({
            p1: P1.RECEIVE_REST,
            p2: P2.UNUSED,
            data: Buffer.from(""),
        })    
        const [msgLen, chunkLen, decoded] = chunkBy(response, [2, 1])
        const msg2 = decoded
        const totalLen2 = msgLen.readUInt16LE()
        const len2 = chunkLen.readUInt8()
        len += len2;
        msg = Buffer.concat([msg, msg2])
        if (totalLen != totalLen2) {
            throw new DeviceStatusError(DeviceStatusCodes.ERR_INVALID_STATE);
        }
    }
    if (totalLen != len) {
        throw new DeviceStatusError(DeviceStatusCodes.ERR_INVALID_STATE);
    }

    return {message: msg}
}
