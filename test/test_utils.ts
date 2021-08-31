// @ts-ignore
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid"

import Fio from "../src/fio"

export async function getTransport() {
    return await TransportNodeHid.create(1000)
}

export async function getFio() {
    const transport = await TransportNodeHid.create(1000)

    const fio = new Fio(transport);
    (fio as any).t = transport
    return Promise.resolve(fio)
}
