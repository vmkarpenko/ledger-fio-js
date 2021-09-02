import type { HexString, ParsedTransaction, ParsedTransferFIOTokensData, Uint8_t, ValidBIP32Path } from "types/internal"

import type {SignedTransactionData, Version } from "../types/public"
import { HARDENED, Transaction } from "../types/public"
import { chunkBy } from "../utils/ioHelpers"
import { INS } from "./common/ins"
import type { Interaction, SendParams } from "./common/types"
import { ensureLedgerAppVersionCompatible } from "./getVersion"
import { date_to_buf, uint16_to_buf, uint32_to_buf, buf_to_hex, hex_to_buf, path_to_buf, uint64_to_buf } from "../utils/serialize"
import { uint8_to_buf } from "../../dist/src/utils/serialize"
import { validate } from "../utils/parse"
import { InvalidDataReason } from "../errors"

const enum P1 {
  STAGE_INIT = 0x01,
  STAGE_HEADER = 0x02,
  STAGE_ACTION_HEADER = 0x03,
  STAGE_ACTION_AUTHORIZATION = 0x04,
  STAGE_ACTION_DATA = 0x05,
  STAGE_WITNESSES = 0x10,
}

const send = (params: {
  p1: number,
  p2: number,
  data: Buffer,
  expectedResponseLength?: number
}): SendParams => ({ ins: INS.SIGN_TX, ...params })



export function* signTransaction(version: Version, parsedPath: ValidBIP32Path, chainId: HexString, tx: ParsedTransaction): Interaction<SignedTransactionData> {
    ensureLedgerAppVersionCompatible(version)
     
    //Initialize and send chainId
    {
        const P2_UNUSED = 0x00
        const response = yield send({
            p1: P1.STAGE_INIT,
            p2: P2_UNUSED,
            data: Buffer.from(chainId, "hex"),
            expectedResponseLength: 0,
        })
    }
    //Send expiration, ref block num, ref block prefix
    {
        const P2_UNUSED = 0x00
        const response = yield send({
            p1: P1.STAGE_HEADER,
            p2: P2_UNUSED,
            data: Buffer.concat([date_to_buf(tx.expiration), uint16_to_buf(tx.ref_block_num), uint32_to_buf(tx.ref_block_prefix)]),
            expectedResponseLength: 0,
        })
    }
    //Send action account, name, acount, permission level
    {
        const P2_UNUSED = 0x00
        const contractAccountName : Buffer = Buffer.from(tx.actions[0].contractAccountName, "hex")
        const response = yield send({
            p1: P1.STAGE_ACTION_HEADER,
            p2: P2_UNUSED,
            data: Buffer.concat([contractAccountName,]),
            expectedResponseLength: 0,
      })
    }
    //Send action authorization
    {
      const P2_UNUSED = 0x00
      const response = yield send({
          p1: P1.STAGE_ACTION_AUTHORIZATION,
          p2: P2_UNUSED,
          data: Buffer.concat([Buffer.from(tx.actions[0].authorization[0].actor, "hex"),
                               Buffer.from(tx.actions[0].authorization[0].permission, "hex")]),
          expectedResponseLength: 0,
      })
    }

    //prepare to send action data
    const actionData: ParsedTransferFIOTokensData = tx.actions[0].data
    const actionDataLenght: number = 
            1 + actionData.payee_public_key.length //pubkeylenght + pubkey
          + 3*8 //amount, max_fee, actor
          + 1 + actionData.tpid.length //tpid length + tpid

    validate(actionDataLenght < 128, InvalidDataReason.ACTION_DATA_TOO_LONG)

    //Send action data
    {
      const P2_UNUSED = 0x00
      const response = yield send({
          p1: P1.STAGE_ACTION_DATA,
          p2: P2_UNUSED,
          data: Buffer.concat([uint8_to_buf(actionDataLenght as Uint8_t),
                               uint8_to_buf(actionData.payee_public_key.length as Uint8_t),
                               Buffer.from(actionData.payee_public_key),
                               uint8_to_buf(0 as Uint8_t), //we add trailing zero to the string to help ledger displaying
                               uint64_to_buf(actionData.amount),
                               uint64_to_buf(actionData.max_fee),
                               Buffer.from(actionData.actor, "hex"),
                               uint8_to_buf(actionData.tpid.length as Uint8_t),
                               Buffer.from(actionData.tpid),
                               uint8_to_buf(0 as Uint8_t), //we add trailing zero to the string to help ledger displaying
                               ]),
          expectedResponseLength: 0,
      })
    }

    //Send witnesses
    const P2_UNUSED = 0x00
    const response = yield send({
        p1: P1.STAGE_WITNESSES,
        p2: P2_UNUSED,
        data: Buffer.concat([path_to_buf(parsedPath)]),
        expectedResponseLength: 65+32,
    })

    const [witnessSignature, hash] = chunkBy(response, [65, 32])
    return { txHashHex: buf_to_hex(hash), witness: {path: [44 + HARDENED, 235 + HARDENED, 0+ HARDENED, 0, 0], witnessSignatureHex: buf_to_hex(witnessSignature)}}
}
