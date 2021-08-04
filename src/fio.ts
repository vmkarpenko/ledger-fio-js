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
import type { Version, Serial, BIP32Path, ExtendedPublicKey } from './types/public'
import type { ValidBIP32Path } from './types/internal'
import type { Interaction, SendParams } from './interactions/common/types'
import { getVersion } from "./interactions/getVersion"
import { getSerial } from "./interactions/getSerial"
import { getExtendedPublicKeys } from "./interactions/getExtendedPublicKeys"
import { isArray, parseBIP32Path, validate } from './utils/parse'
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
            if (e && e.statusCode) {
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
          "getExtendedPublicKeys",
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
    return { version, compatibility: 0 }
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
   * Get several public keys; one for each of the specified BIP 32 path.
   *
   * @param paths The paths. A path must begin with `44'/235'/account'`, and may be up to 10 indexes long.
   * @returns The extended public keys (i.e. with chaincode) for the given paths.
   *
   * @example
   * ```
   * const [{ publicKey, chainCode }] = await fio.getExtendedPublicKeys([[ HARDENED + 44, HARDENED + 235, HARDENED + 1 ]]);
   * console.log(publicKey);
   * ```
   */
   async getExtendedPublicKeys({ paths }: GetExtendedPublicKeysRequest): 
                               Promise<GetExtendedPublicKeysResponse> {
    // validate the input
    validate(isArray(paths), InvalidDataReason.GET_EXT_PUB_KEY_PATHS_NOT_ARRAY)
    const parsed = paths.map((path) => parseBIP32Path(path, InvalidDataReason.INVALID_PATH))
    
    return interact(this._getExtendedPublicKeys(parsed), this._send)
  }

  /** @ignore */
  *_getExtendedPublicKeys(paths: ValidBIP32Path[]) {
      const version = yield* getVersion()
      return yield* getExtendedPublicKeys(version, paths)
  }

  /**
   * Get a public key from the specified BIP 32 path.
   *
   */
  async getExtendedPublicKey(
      { path }: GetExtendedPublicKeyRequest
  ): Promise<GetExtendedPublicKeyResponse> {
      return (await this.getExtendedPublicKeys({ paths: [path] }))[0]
  }

}

export type GetVersionResponse = {
    version: Version
    compatibility: Number //for now
  }

/**
 * Get device serial number ([[Fio.getSerial]]) response data
 * @category Main
 */
 export type GetSerialResponse = Serial

 /**
 * Get multiple public keys ([[Fio.getExtendedPublicKeys]]) request data
 * @category Main
 * @see [[GetExtendedPublicKeysResponse]]
 */
export type GetExtendedPublicKeysRequest = {
    /** Paths to public keys which should be derived by the device */
    paths: BIP32Path[]
}
  
/**
 * [[Fio.getExtendedPublicKeys]] response data
 * @category Main
 * @see [[GetExtendedPublicKeysRequest]]
 */
  export type GetExtendedPublicKeysResponse = Array<ExtendedPublicKey>
  
  /**
 * Get single public keys ([[Fio.getExtendedPublicKey]]) request data
 * @category Main
 * @see [[GetExtendedPublicKeysResponse]]
 */
export type GetExtendedPublicKeyRequest = {
    /** Path to public key which should be derived */
    path: BIP32Path
  }
  /**
   * Get single public key ([[Fio.getExtendedPublicKey]]) response data
   * @category Main
   * @see [[GetExtendedPublicKeysResponse]]
   */
  export type GetExtendedPublicKeyResponse = ExtendedPublicKey
  