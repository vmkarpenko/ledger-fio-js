import { ValidBIP32Path } from "types/internal"
import { Version, Transaction, SignedTransactionData, HARDENED } from "../types/public"
import { INS } from "./common/ins"
import type { Interaction, SendParams } from "./common/types"
import { ensureLedgerAppVersionCompatible } from "./getVersion"
import {uint64_to_buf, buf_to_hex} from "../utils/serialize"



const send = (params: {
  p1: number,
  p2: number,
  data: Buffer,
  expectedResponseLength?: number
}): SendParams => ({ ins: INS.SIGN_TX, ...params })


export function* signTransaction(version: Version, parsedPath: ValidBIP32Path, tx: Transaction): Interaction<SignedTransactionData> {
    ensureLedgerAppVersionCompatible(version)

    const createHash = require('create-hash')
    console.log(createHash('sha256').update(uint64_to_buf(tx.fee)).digest(null))

    const P1_UNUSED = 0x00
    const P2_UNUSED = 0x00
    const response = yield send({
        p1: P1_UNUSED,
        p2: P2_UNUSED,
        data: uint64_to_buf(tx.fee),
        expectedResponseLength: 32,
    })
 
    console.log(response) 

    //    const serial = utils.buf_to_hex(response) TODO
    return { txHashHex: buf_to_hex(response), witness: {path: [44 + HARDENED, 235 + HARDENED, 0+ HARDENED, 0, 0], witnessSignatureHex: ""}}
}
