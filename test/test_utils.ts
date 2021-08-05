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

const ProtocolMagics = {
    MAINNET: 764824073,
    TESTNET: 42,
}

const NetworkIds = {
    TESTNET: 0x00,
    MAINNET: 0x01,
}

export const Networks = {
    Mainnet: {
        networkId: NetworkIds.MAINNET,
        protocolMagic: ProtocolMagics.MAINNET,
    },
    Testnet: {
        networkId: NetworkIds.TESTNET,
        protocolMagic: ProtocolMagics.TESTNET,
    },
    Fake: {
        networkId: 0x03,
        protocolMagic: 47,
    },
}