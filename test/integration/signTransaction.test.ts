import { expect } from "chai"
import { Uint64_str, HexString } from "types/internal"
import { uint64_to_buf, hex_to_buf } from "../../src/utils/serialize"

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
        //We prepare derivation path, public key, and private key
        const path = [44 + HARDENED, 235 + HARDENED, 0 + HARDENED, 0, 0];
        const privateKeyDHex = "4d597899db76e87933e7c6841c2d661810f070bad20487ef20eb84e182695a3a" as HexString
        const PrivateKey = require('@fioprotocol/fiojs/dist/ecc/key_private')
        const privateKey = PrivateKey(hex_to_buf(privateKeyDHex))
        const publicKey = privateKey.toPublic()
        console.log(publicKey.toUncompressed().toHex())

        //Let us prepare a transaction (not not necesarily valid for now)
        const tx = {fee: "19" as Uint64_str};
        const chainId = 'b20901380af44ef59c5918439a1f9a41d83669020319a80574b804a5f95cbd7e' as HexString;

        //Lets compute its signature in using Signature.sign
        const Signature = require('@fioprotocol/fiojs/dist/ecc/signature');
        const msg = Buffer.concat([Buffer.from(chainId, "hex"), uint64_to_buf(tx.fee), Buffer.allocUnsafe(32).fill(0)])
        const crypto = require("crypto")
        console.log("Using Signature.sign")
        console.log({"msg": msg.toString('hex'), 
                     "Hash": crypto.createHash('sha256').update(msg).digest('hex'), 
                     "SignatureHex": Signature.sign(msg, privateKey).toHex(),
                     "SignatureString": Signature.fromHex(Signature.sign(msg, privateKey).toHex()).toString()});                     
                     
        //Now lets do the same using signatureProvider.sign
        const { JsSignatureProvider } = require('@fioprotocol/fiojs/dist/chain-jssig');
        const signatureProvider = new JsSignatureProvider([PrivateKey.fromHex(privateKeyDHex).toString()]);
        const requiredKeys = [publicKey.toString()];
        const serializedTransaction = uint64_to_buf(tx.fee)
        const serializedContextFreeData = null;

        const signedTxn = await signatureProvider.sign({
          chainId: chainId,
          requiredKeys: requiredKeys,
          serializedTransaction: serializedTransaction,
          serializedContextFreeData: serializedContextFreeData
        });

        console.log("using JsSignatureProvider.sign")
        console.log(signedTxn.signatures[0])

        //Lets sign the transaction with ledger
        const response = await fio.signTransaction({path, chainId, tx });
        console.log("Using ledger")
        console.log(response)
        console.log("Using ledger toString")
        console.log(Signature.fromHex(response.witness.witnessSignatureHex).toString())
    })
})
