import { HexString, ValidBIP32Path, ParsedTransaction } from "types/internal"
import { Version, Transaction, SignedTransactionData, HARDENED } from "../types/public"
import { INS } from "./common/ins"
import type { Interaction, SendParams } from "./common/types"
import { ensureLedgerAppVersionCompatible } from "./getVersion"
import { uint64_to_buf, buf_to_hex, hex_to_buf, path_to_buf } from "../utils/serialize"
import { chunkBy } from "../utils/ioHelpers"

const enum P1 {
  STAGE_INIT = 0x01,
  STAGE_FEE = 0x02,
  STAGE_WITNESSES = 0x03,
}

const send = (params: {
  p1: number,
  p2: number,
  data: Buffer,
  expectedResponseLength?: number
}): SendParams => ({ ins: INS.SIGN_TX, ...params })



export function* signTransaction(version: Version, parsedPath: ValidBIP32Path, chainId: HexString, tx: ParsedTransaction): Interaction<SignedTransactionData> {
    ensureLedgerAppVersionCompatible(version)
     
    //Initialize
    {
      const P2_UNUSED = 0x00
      const response = yield send({
          p1: P1.STAGE_INIT,
          p2: P2_UNUSED,
          data: Buffer.from(chainId, "hex"),
          expectedResponseLength: 0,
      })
    }
    //Send chainId
    {
        const P2_UNUSED = 0x00
        const response = yield send({
            p1: P1.STAGE_FEE,
            p2: P2_UNUSED,
            data: uint64_to_buf(tx.actions[0].amount),
            expectedResponseLength: 0,
        })
    }
    //Send witnesses
    const P2_UNUSED = 0x00
    const response = yield send({
        p1: P1.STAGE_WITNESSES,
        p2: P2_UNUSED,
        data: Buffer.concat([path_to_buf(parsedPath),]),
        expectedResponseLength: 65+32,
    })

    const [witnessSignature, hash] = chunkBy(response, [65, 32])
    return { txHashHex: buf_to_hex(hash), witness: {path: [44 + HARDENED, 235 + HARDENED, 0+ HARDENED, 0, 0], witnessSignatureHex: buf_to_hex(witnessSignature)}}
}
