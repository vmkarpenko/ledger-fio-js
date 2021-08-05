import { expect } from "chai"

import type Fio from "../../src/fio"
import { getFio } from "../test_utils"

describe("getVersion", async () => {
    let fio: Fio = {} as Fio

    beforeEach(async () => {
        fio = await getFio()
    })

    afterEach(async () => {
        await (fio as any).t.close()
    })

    it("Should correctly get the semantic version of device", async () => {
        const { version } = await fio.getVersion()

        expect(version.major).to.equal(0)
        expect(version.minor).to.equal(0)
    })
})
