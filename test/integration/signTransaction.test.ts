import { expect } from "chai"
import { Uint64_str } from "types/internal"

import type Fio from "../../src/fio"
import { HARDENED } from "../../src/fio"
import { getFio } from "../test_utils"

describe("signTransaction", async () => {
    let fio: Fio = {} as Fio

    beforeEach(async () => {
        fio = await getFio()
    })

    afterEach(async () => {
        await (fio as any).t.close()
    })

    it("Should correctly get some response", async () => {
        const response = await fio.signTransaction({path:[44 + HARDENED, 235 + HARDENED, 0 + HARDENED, 0, 0], tx: {fee: "12" as Uint64_str}})
    })
})
