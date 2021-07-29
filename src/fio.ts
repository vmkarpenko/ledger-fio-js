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
import { DeviceStatusCodes, DeviceStatusError, DeviceVersionUnsupported } from './errors'
const CLA = 0xd7

export const enum INS {
  GET_VERSION = 0x00, GET_VERSION2 = 0x01
}

export type SendParams = {
    ins: number;
    p1: number;
    p2: number;
    data: Buffer;
    expectedResponseLength?: number;
};

export type Interaction<RetValue> = Generator<SendParams, RetValue, Buffer>;
/** @ignore */
export type SendFn = (params: SendParams) => Promise<Buffer>;


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


export type Flags = {
    isDebug: boolean,
};

export type Version = {
    major: number,
    minor: number,
    patch: number,
    flags: Flags,
};

export type GetVersionResponse = {
    version: Version
    compatibility: Number //for now
  }
  
  


export function* getVersion(): Interaction<Version> {
    // moving getVersion() logic to private function in order
    // to disable concurrent execution protection done by this.transport.decorateAppAPIMethods()
    // when invoked from within other calls to check app version

    const P1_UNUSED = 0x00
    const P2_UNUSED = 0x00
    const response = yield {
        ins: INS.GET_VERSION,
        p1: P1_UNUSED,
        p2: P2_UNUSED,
        data: Buffer.alloc(0),
        expectedResponseLength: 4,
    }

    const [major, minor, patch, flags_value] = response

    const FLAG_IS_DEBUG = 1
    //const FLAG_IS_HEADLESS = 2;

    const flags = {
        isDebug: (flags_value & FLAG_IS_DEBUG) === FLAG_IS_DEBUG,
    }
    return { major, minor, patch, flags }
}



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

// Just for consistency
/** @ignore */
*_getVersion(): Interaction<Version> {
    return yield* getVersion()
}

}

