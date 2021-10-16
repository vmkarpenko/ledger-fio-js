import { PublicKey } from "../../dist/src/fio"
import {ValidBIP32Path, WIF_PUBLIC_KEY_LENGTH} from "../types/internal"
import {PUBLIC_KEY_LENGTH} from "../types/internal"
import type {Version} from "../types/public"
import {assert} from "../utils/assert"
import {chunkBy} from "../utils/ioHelpers"
import {path_to_buf} from "../utils/serialize"
import {INS} from "./common/ins"
import type {Interaction, SendParams} from "./common/types"
import {ensureLedgerAppVersionCompatible} from "./getVersion"
import {GetPublicKeyResponse} from "../fio"

const send = (params: {
    p1: number,
    p2: number,
    data: Buffer,
    expectedResponseLength?: number
}): SendParams => ({ins: INS.GET_EXT_PUBLIC_KEY, ...params})


export function* getPublicKey(
    version: Version,
    path: ValidBIP32Path,
    show_or_not: boolean
): Interaction<GetPublicKeyResponse> {
    ensureLedgerAppVersionCompatible(version)

    const enum P1 {
        SHOW = 0x01,
        DO_NOT_SHOW = 0x02,
    }

    const enum P2 {
        UNUSED = 0x00,
    }

    const pathData = Buffer.concat([
        path_to_buf(path),
    ])

    let response: Buffer

    // passing empty Buffer for backwards compatibility
    // of single key export on Ledger app version 2.0.4
    const remainingKeysData = Buffer.from([])

    response = yield send({
        p1: show_or_not ? P1.SHOW : P1.DO_NOT_SHOW,
        p2: P2.UNUSED,
        data: Buffer.concat([pathData, remainingKeysData]),
        expectedResponseLength: PUBLIC_KEY_LENGTH + WIF_PUBLIC_KEY_LENGTH,
    })

    const [publicKey, publicKeyWIF, rest] = chunkBy(response, [PUBLIC_KEY_LENGTH, WIF_PUBLIC_KEY_LENGTH])
    assert(rest.length === 0, "invalid response length")

    return {
        publicKeyHex: publicKey.toString("hex"),
        publicKeyWIF: publicKeyWIF.toString()
    }
}
