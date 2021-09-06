import {expect} from "chai"
import {log} from "console"
import {type} from "os"
import type {HexString, Uint64_str} from "types/internal"
import {assert} from "utils/assert"

import type {Fio} from "../../src/fio"
import {DeviceStatusError, HARDENED} from "../../src/fio"
import type {Transaction} from "../../src/types/public"
import {hex_to_buf, uint64_to_buf} from "../../src/utils/serialize"
import {getFio} from "../test_utils"

// We initialize constants
const path = [44 + HARDENED, 235 + HARDENED, 0 + HARDENED, 0, 0]
const privateKeyDHex = "4d597899db76e87933e7c6841c2d661810f070bad20487ef20eb84e182695a3a" as HexString
const PrivateKey = require('@fioprotocol/fiojs/dist/ecc/key_private')
const privateKey = PrivateKey(hex_to_buf(privateKeyDHex))
const publicKey = privateKey.toPublic()

const {TextEncoder, TextDecoder} = require('text-encoding')
const fetch = require('node-fetch')
const {base64ToBinary, arrayToHex} = require('@fioprotocol/fiojs/dist/chain-numeric')
const Signature = require('@fioprotocol/fiojs/dist/ecc/signature')
const crypto = require("crypto")
var ser = require("@fioprotocol/fiojs/dist/chain-serialize")
const textDecoder = new TextDecoder()
const textEncoder = new TextEncoder()
const {JsSignatureProvider} = require('@fioprotocol/fiojs/dist/chain-jssig')

// To do this we must perform asynchronous calls, initialized in before method
const httpEndpointTestnet = 'http://testnet.fioprotocol.io'
const httpEndpointMainnet = 'https://fio.greymass.com'
var networkInfo: any


// Serializes and signs transaction using fiojs
async function buildTxAndSignatureFioJs(network: string, tx: Transaction) {
    // We serialize the transaction
    // Get the addaddress action type
    const actionAddaddress = networkInfo[network].typesFioAddress.get('trnsfiopubky')

    // Serialize the actions[] "data" field (This example assumes a single action, though transactions may hold an array of actions.)
    const buffer = new ser.SerialBuffer({textEncoder, textDecoder})
    actionAddaddress.serialize(buffer, tx.actions[0].data)
    const serializedData = arrayToHex(buffer.asUint8Array())

    // Get the actions parameter from the transaction and replace the data field with the serialized data field
    var serializedAction = tx.actions[0] as any
    serializedAction = {
        ...serializedAction,
        data: serializedData,
    }

    const rawTransaction = {
        ...tx,
        max_net_usage_words: 0x00,
        max_cpu_usage_ms: 0x00,
        delay_sec: 0x00,
        context_free_actions: [],
        actions: [serializedAction],     //Actions have to be an array
        transaction_extensions: [],
    }

    // Get the transaction action type
    const txnaction = networkInfo[network].typesTransaction.get('transaction')

    // Serialize the transaction
    const buffer2 = new ser.SerialBuffer({textEncoder, textDecoder})
    txnaction.serialize(buffer2, rawTransaction)
    const serializedTransaction = buffer2.asUint8Array()

    //Lets compute hash in using Signature.sign
    const msg = Buffer.concat([Buffer.from(networkInfo[network].chainId, "hex"), serializedTransaction, Buffer.allocUnsafe(32).fill(0)])
    const hash = crypto.createHash('sha256').update(msg).digest('hex')

    //Now using signatureProvider.sign
    const signatureProvider = new JsSignatureProvider([PrivateKey.fromHex(privateKeyDHex).toString()])
    const requiredKeys = [publicKey.toString()]
    const serializedContextFreeData = null

    const signedTxn = await signatureProvider.sign({
        chainId: networkInfo[network].chainId,
        requiredKeys: requiredKeys,
        serializedTransaction: serializedTransaction,
        serializedContextFreeData: serializedContextFreeData,
    })

    return {
        serializedTx: serializedTransaction,
        fullMsg: msg,
        hash: crypto.createHash('sha256').update(msg).digest('hex'),
        signature: signedTxn.signatures[0],
    }
}

const basicTx: Transaction = {
    expiration: "2021-08-28T12:50:36.686",
    ref_block_num: 0x1122,
    ref_block_prefix: 0x33445566,
    context_free_actions: [],
    actions: [{
        account: "fio.token",
        name: "trnsfiopubky",
        authorization: [{
            actor: "aftyershcu22",
            permission: "active",
        }],
        data: {
            payee_public_key: "FIO8PRe4WRZJj5mkem6qVGKyvNFgPsNnjNN6kPhh6EaCpzCVin5Jj",
            amount: "20",
            max_fee: 0x11223344,
            tpid: "rewards@wallet",
            actor: "aftyershcu22",
        },
    }],
    transaction_extensions: null,
}

describe("signTransaction", async () => {
    let fio: Fio = {} as Fio

    before(async () => {
        const infoTestnet = await (await fetch(httpEndpointTestnet + '/v1/chain/get_info')).json()
        const infoMainnet = await (await fetch(httpEndpointMainnet + '/v1/chain/get_info')).json()

        const abiFioAddressTestnet = await (await fetch(httpEndpointTestnet + '/v1/chain/get_abi', {
            body: `{"account_name": "fio.token"}`,
            method: 'POST',
        })).json()
        const abiMsigTestnet = await (await fetch(httpEndpointTestnet + '/v1/chain/get_abi', {
            body: `{"account_name": "eosio.msig"}`,
            method: 'POST',
        })).json()
        const abiFioAddressMainnet = await (await fetch(httpEndpointMainnet + '/v1/chain/get_abi', {
            body: `{"account_name": "fio.token"}`,
            method: 'POST',
        })).json()
        const abiMsigMainnet = await (await fetch(httpEndpointMainnet + '/v1/chain/get_abi', {
            body: `{"account_name": "eosio.msig"}`,
            method: 'POST',
        })).json()

        // Get a Map of all the types from fio.address
        const typesFioAddressTestnet = ser.getTypesFromAbi(ser.createInitialTypes(), abiFioAddressTestnet.abi)
        const typesTransactionTestnet = ser.getTypesFromAbi(ser.createInitialTypes(), abiMsigTestnet.abi)
        const typesFioAddressMainnet = ser.getTypesFromAbi(ser.createInitialTypes(), abiFioAddressMainnet.abi)
        const typesTransactionMainnet = ser.getTypesFromAbi(ser.createInitialTypes(), abiMsigMainnet.abi)
        networkInfo = {
            "TESTNET": {
                chainId: infoTestnet.chain_id,
                typesFioAddress: typesFioAddressTestnet,
                typesTransaction: typesTransactionTestnet,
            },
            "MAINNET": {
                chainId: infoMainnet.chain_id,
                typesFioAddress: typesFioAddressMainnet,
                typesTransaction: typesTransactionMainnet,
            },
        }

    })

    beforeEach(async () => {
        fio = await getFio()
    })

    afterEach(async () => {
        await (fio as any).t.close()
    })

    it("Sign testnet transaction", async () => {
        const network = "TESTNET"
        const tx = basicTx

        // Lets sign the transaction with fiojs
        const {serializedTx, fullMsg, hash, signature} = await buildTxAndSignatureFioJs(network, tx)

        // Lets sign the transaction with ledger
        const chainId = networkInfo[network].chainId
        const ledgerResponse = await fio.signTransaction({path, chainId, tx})
        const signatureLedger = Signature.fromHex(ledgerResponse.witness.witnessSignatureHex)

        expect(ledgerResponse.txHashHex).to.be.equal(hash)
        expect(signatureLedger.verify(fullMsg, publicKey))
    })

    it("Sign mainnet transaction", async () => {
        const network = "MAINNET"
        const tx = basicTx

        // Lets sign the transaction with fiojs
        const {serializedTx, fullMsg, hash, signature} = await buildTxAndSignatureFioJs(network, tx)

        // Lets sign the transaction with ledger
        const chainId = networkInfo[network].chainId
        const ledgerResponse = await fio.signTransaction({path, chainId, tx})
        const signatureLedger = Signature.fromHex(ledgerResponse.witness.witnessSignatureHex)

        expect(ledgerResponse.txHashHex).to.be.equal(hash)
        expect(signatureLedger.verify(fullMsg, publicKey))
    })

    it("Invalid transaction: actor dont match", async () => {
        const network = "MAINNET"
        const action = {...basicTx.actions[0], name: "name.error"}
        const tx: Transaction = {...basicTx, actions: [action]}

        // Lets sign the transaction with ledger
        const chainId = networkInfo[network].chainId
        const promise = fio.signTransaction({path, chainId, tx})
        await expect(promise).to.be.rejected
    })

    it("Path rejected by ledger", async () => {
        const network = "MAINNET"
        const tx = basicTx

        // Lets sign the transaction with ledger
        const chainId = networkInfo[network].chainId
        const promise = fio.signTransaction({path: [44 + HARDENED, 235 + HARDENED, 0 + HARDENED, 1, 0], chainId, tx})
        await expect(promise).to.be.rejectedWith(DeviceStatusError, "Action rejected by Ledger's security policy")
    })
})
