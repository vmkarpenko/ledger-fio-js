/********************************************************************************
 *   Ledger Node JS API
 *   (c) 2016-2017 Ledger
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ********************************************************************************/
import type Transport from "@ledgerhq/hw-transport"
import { DeviceStatusCodes, DeviceStatusError} from './errors'
import { InvalidDataReason } from "./errors/invalidDataReason"
import type { DeviceCompatibility, Version, Serial, BIP32Path, PublicKey, Transaction, SignedTransactionData } from './types/public'
import type { ValidBIP32Path } from './types/internal'
import type { Interaction, SendParams } from './interactions/common/types'
import { getVersion, getCompatibility } from "./interactions/getVersion"
import { getSerial } from "./interactions/getSerial"
import { getPublicKey } from "./interactions/getPublicKey"
import { signTransaction } from "./interactions/signTransaction"
import { runTests } from "./interactions/runTests"
import { parseBIP32Path, validate, isValidPath } from './utils/parse'
import utils from "./utils"
import { assert } from './utils/assert'

export * from './errors'
export * from './types/public'

const CLA = 0xd7

function wrapConvertDeviceStatusError<T extends Function>(fn: T): T {
    // @ts-ignore
    return async (...args) => {
        try {
            return await fn(...args)
        } catch (e) {
            console.log("CHYBA!!!")
            console.log(e.statusCode)
            console.log(e)
            if (e && e.statusCode) {
                console.log("We throw DeviceStatusError")
                throw new DeviceStatusError(e.statusCode)
            }
            throw e
        }
    }
}

/**
 * FIO API
 *
 * @example
 * import Fio from "";
 * const fio = new Fio(transport);
 */

/** @ignore */
export type SendFn = (params: SendParams) => Promise<Buffer>;

// It can happen that we try to send a message to the device
// when the device thinks it is still in a middle of previous ADPU stream.
// This happens mostly if host does abort communication for some reason
// leaving ledger mid-call.
// In this case Ledger will respond by ERR_STILL_IN_CALL *and* resetting its state to
// default. We can therefore transparently retry the request.

// Note though that only the *first* request in an multi-APDU exchange should be retried.
function wrapRetryStillInCall<T extends Function>(fn: T): T {
    // @ts-ignore
    return async (...args: any) => {
        try {
            return await fn(...args)
        } catch (e) {
            if (
                e &&
        e.statusCode &&
        e.statusCode === DeviceStatusCodes.ERR_STILL_IN_CALL
            ) {
                // Do the retry
                return await fn(...args)
            }
            throw e
        }
    }
}


async function interact<T>(
    interaction: Interaction<T>,
    send: SendFn,
): Promise<T> {
    let cursor = interaction.next()
    let first = true
    while (!cursor.done) {
        const apdu = cursor.value
        const res = first
            ? await wrapRetryStillInCall(send)(apdu)
            : await send(apdu)
        first = false
        cursor = interaction.next(res)
    }
    return cursor.value
}

/**
 * Main API endpoint
 * @category Main
 */

export class Fio {
  /** @ignore */
  transport: Transport<string>;
  /** @ignore */
  _send: SendFn;

  constructor(transport: Transport<string>, scrambleKey: string = "FIO") {
      this.transport = transport
      // Note: this is list of methods that should "lock" the transport to avoid concurrent use
      const methods = [
          "getVersion",
          "getSerial",
          "getPublicKey",
      ]
      this.transport.decorateAppAPIMethods(this, methods, scrambleKey)
      this._send = async (params: SendParams): Promise<Buffer> => {
          let response = await wrapConvertDeviceStatusError(this.transport.send)(
              CLA,
              params.ins,
              params.p1,
              params.p2,
              params.data
          )
          console.log("Dostal som sa sem!!!")
          response = utils.stripRetcodeFromResponse(response)

          if (params.expectedResponseLength != null) {
              assert(
                  response.length === params.expectedResponseLength,
                  `unexpected response length: ${response.length} instead of ${params.expectedResponseLength}`
              )
          }

          return response
      }
  }

  /**
   * Returns an object containing the app version.
   *
   * @returns Result object containing the application version number.
   *
   * @example
   * const { major, minor, patch, flags } = await fio.getVersion();
   * console.log(`App version ${major}.${minor}.${patch}`);
   *
   */
   async getVersion(): Promise<GetVersionResponse> {
    const version = await interact(this._getVersion(), this._send)
    return { version, compatibility: getCompatibility(version) }
  }

  /** @ignore */
  *_getVersion(): Interaction<Version> {
    return yield* getVersion()
  }

  /**
   * Returns an object containing the device serial number.
   *
   * @returns Result object containing the device serial number.
   *
   * @example
   * const { serial } = await fio.getSerial();
   * console.log(`Serial number ${serial}`);
   *
   */
   async getSerial(): Promise<GetSerialResponse> {
     return interact(this._getSerial(), this._send)
  }
  
  /** @ignore */
  *_getSerial(): Interaction<GetSerialResponse> {
    const version = yield* getVersion()
    return yield* getSerial(version)
  }
  
  /**
   * Get public key for the specified BIP 32 path.
   *
   * @param path The path. A path must begin with `44'/235'/0'/0/i`.
   * @returns The public key (i.e. with chaincode).
   *
   * @example
   * ```
   * const publicKey = await fio.getPublicKey[[ HARDENED + 44, HARDENED + 235, HARDENED + 0, 0, 0 ]);
   * console.log(publicKey);
   * ```
   */
   async getPublicKey({path}: GetPublicKeyRequest): 
                               Promise<GetPublicKeyResponse> {
    // validate the input
    validate(isValidPath(path), InvalidDataReason.GET_EXT_PUB_KEY_PATHS_NOT_ARRAY)
    const parsed = parseBIP32Path(path, InvalidDataReason.INVALID_PATH)

    return interact(this._getPublicKey(parsed), this._send)
  }

  /** @ignore */
  *_getPublicKey(path: ValidBIP32Path) {
      const version = yield* getVersion()
      return yield* getPublicKey(version, path)
  }

  /**
   * Sign transaction.
   *
   * @param path The path. A path must begin with `44'/235'/0'/0/i`.
   * @returns The public key (i.e. with chaincode).
   *
   * @example
   * ```
   * const publicKey = await fio.getPublicKey[[ HARDENED + 44, HARDENED + 235, HARDENED + 0, 0, 0 ]); TODO
   * console.log(publicKey);
   * ```
   */
   async signTransaction({path, tx}: SignTransactionRequest): 
                               Promise<SignTransactionResponse> {
    // validate the input TODO validate transaction
    validate(isValidPath(path), InvalidDataReason.GET_EXT_PUB_KEY_PATHS_NOT_ARRAY)
    const parsedPath = parseBIP32Path(path, InvalidDataReason.INVALID_PATH)

    return interact(this._signTransaction(parsedPath, tx), this._send)
  }

  /** @ignore */
  *_signTransaction(parsedPath: ValidBIP32Path, tx: Transaction) {
      const version = yield* getVersion()
      return yield* signTransaction(version, parsedPath, tx)
  }


  /**
   * Runs unit tests on the device (DEVEL app build only)
   */
   async runTests(): Promise<void> {
    return interact(this._runTests(), this._send)
  }

  /** @ignore */
  *_runTests(): Interaction<void> {
    const version = yield* getVersion()
    return yield* runTests(version)
  }

}

export type GetVersionResponse = {
    version: Version
    compatibility: DeviceCompatibility
}

/**
 * Get device serial number ([[Fio.getSerial]]) response data
 * @category Main
 */
 export type GetSerialResponse = Serial

    
  /**
 * Get public key ([[Fio.getPublicKey]]) request data
 * @category Main
 * @see [[GetPublicKeyResponse]]
 */
  export type GetPublicKeyRequest = {
    /** Paths to public keys which should be derived by the device */
    path: BIP32Path
  }
  
  /**
   * Get public key ([[Fio.getPublicKey]]) response data
   * @category Main
   * @see [[GetPublicKeyRequest]]
   */
  export type GetPublicKeyResponse = PublicKey
  
  /**
 * Sign transaction  ([[Fio.signTransaction]]) request data
 * @category Main
 * @see [[SignTransactionResponse]]
 */
   export type SignTransactionRequest = {
    /** Paths to public keys which should be derived by the device */
    path: BIP32Path
    tx: Transaction
  }
  
  /**
   * Get single public key ([[Fio.signTransaction]]) response data
   * @category Main
   * @see [[SignTransactionRequest]]
   */
  export type SignTransactionResponse = SignedTransactionData
  
  export default Fio
