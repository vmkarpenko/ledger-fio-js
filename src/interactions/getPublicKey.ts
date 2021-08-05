import type { ValidBIP32Path } from "../types/internal"
import { PUBLIC_KEY_LENGTH } from "../types/internal"
import type { PublicKey, Version } from "../types/public"
import { assert } from "../utils/assert"
import { chunkBy } from "../utils/ioHelpers"
import { path_to_buf, uint32_to_buf } from "../utils/serialize"
import { INS } from "./common/ins"
import type { Interaction, SendParams } from "./common/types"
//import { ensureLedgerAppVersionCompatible } from "./getVersion"


const send = (params: {
  p1: number,
  p2: number,
  data: Buffer,
  expectedResponseLength?: number
}): SendParams => ({ ins: INS.GET_EXT_PUBLIC_KEY, ...params })


export function* getPublicKey(
    version: Version,
    path: ValidBIP32Path
): Interaction<PublicKey> {
//    ensureLedgerAppVersionCompatible(version)

  const enum P1 {
    UNUSED = 0x00,
  }
  const enum P2 {
    UNUSED = 0x00,
  }
  const result = []

  const pathData = Buffer.concat([
      path_to_buf(path),
  ])

  let response: Buffer
  
  // passing empty Buffer for backwards compatibility
  // of single key export on Ledger app version 2.0.4
  const remainingKeysData = Buffer.from([])

  response = yield send({
      p1: P1.UNUSED,
      p2: P2.UNUSED,
      data: Buffer.concat([pathData, remainingKeysData]),
      expectedResponseLength: PUBLIC_KEY_LENGTH,
  })

  const [publicKey, rest] = chunkBy(response, [32,])
  assert(rest.length === 0, "invalid response length")

  result.push()


  return {
    publicKeyHex: publicKey.toString("hex")
  }
}
