import { expect } from "chai"
import { Uint64_str, HexString } from "types/internal"
import { uint64_to_buf, hex_to_buf } from "../../src/utils/serialize"
import { Transaction } from "../../src/types/public"

import type Fio from "../../src/fio"
import { HARDENED } from "../../src/fio"
import { getFio } from "../test_utils"
import { log } from "console"


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
//        const tx = {fee: "19" as Uint64_str};
        const tx: Transaction = { expiration: "",
                                  ref_block_num: 0,
                                  ref_block_prefix: 0,
                                  context_free_actions: [],
                                  actions: [{payee_public_key: "",
                                             amount: "19",
                                             max_fee: "0",
                                             tpid: "",
                                             actor: "",                                    
                                  }],
                                  transaction_extensions: null,
                                };
        const chainId = 'b20901380af44ef59c5918439a1f9a41d83669020319a80574b804a5f95cbd7e' as HexString;

        //Lets compute its signature in using Signature.sign
        const Signature = require('@fioprotocol/fiojs/dist/ecc/signature');
        const serializedTransaction = uint64_to_buf(tx.actions[0].amount as Uint64_str)
        const msg = Buffer.concat([Buffer.from(chainId, "hex"), serializedTransaction, Buffer.allocUnsafe(32).fill(0)])
        const crypto = require("crypto")
        const signature = Signature.sign(msg, privateKey)
        console.log("Using Signature.sign")
        console.log({"msg": msg.toString('hex'), 
                     "Hash": crypto.createHash('sha256').update(msg).digest('hex'), 
                     "SignatureHex": signature.toHex(),
                     "SignatureString": signature.toString(),
                     "Verification": signature.verify(msg, publicKey)
                    });                     
                     
        //Now lets do the same using signatureProvider.sign
        const { JsSignatureProvider } = require('@fioprotocol/fiojs/dist/chain-jssig');
        const signatureProvider = new JsSignatureProvider([PrivateKey.fromHex(privateKeyDHex).toString()]);
        const requiredKeys = [publicKey.toString()];
        const serializedContextFreeData = null;

        const signedTxn = await signatureProvider.sign({
          chainId: chainId,
          requiredKeys: requiredKeys,
          serializedTransaction: serializedTransaction,
          serializedContextFreeData: serializedContextFreeData
        });

    
        //We want to sign the stuff
/*        console.log("SIGNATUREEEEEEE START!!!!!!!!!!!!!!!!");
        console.log("SIGNATUREEEEEEE START!!!!!!!!!!!!!!!!");
        console.log("SIGNATUREEEEEEE START!!!!!!!!!!!!!!!!");
        console.log("SIGNATUREEEEEEE START!!!!!!!!!!!!!!!!");
        console.log("SIGNATUREEEEEEE START!!!!!!!!!!!!!!!!");

        const BigInteger = require('bigi');
        const dataSha256hex = crypto.createHash('sha256').update(msg).digest("hex")
        const dataSha256 = Buffer.from(dataSha256hex, "hex");
        const ecdsa = require('@fioprotocol/fiojs/dist/ecc/ecdsa');
        const curve = require('ecurve').getCurveByName('secp256k1');

        var der, e, ecsignature, i, lenR, lenS, nonce;
        i = null;
        nonce = 0;
        e = BigInteger.fromHex(dataSha256hex);
        while (true) {
          ecsignature = ecdsa.sign(curve, dataSha256, privateKey.d, nonce++);
          console.log(ecsignature.toCompact().toString('hex'));
          der = ecsignature.toDER();
          console.log(der.toString('hex'));
          lenR = der[3];
          lenS = der[5 + lenR];
          if (lenR === 32 && lenS === 32) {
            i = ecdsa.calcPubKeyRecoveryParam(curve, e, ecsignature, privateKey.toPublic().Q);
            i += 4;  // compressed
            i += 27; // compact  //  24 or 27 :( forcing odd-y 2nd key candidate)
            break;
          }
          if (nonce % 1 === 0) {
            console.log("WARN: " + nonce + " attempts to find canonical signature");
          }
        }
        console.log("SIGNATUREEEEEEE END!!!!!!!!!!!!!!!!");
        console.log("SIGNATUREEEEEEE END!!!!!!!!!!!!!!!!");
        console.log("SIGNATUREEEEEEE END!!!!!!!!!!!!!!!!");
        console.log("SIGNATUREEEEEEE END!!!!!!!!!!!!!!!!");
        console.log("SIGNATUREEEEEEE END!!!!!!!!!!!!!!!!");*/

        console.log("using JsSignatureProvider.sign")
        console.log(signedTxn.signatures[0])

        //Lets sign the transaction with ledger
        const response = await fio.signTransaction({path, chainId, tx });
        const signatureLedger = Signature.fromHex(response.witness.witnessSignatureHex)
        console.log("Ledger Response")
        console.log(response)
        console.log("Using ledger toString")
        console.log({"msg": msg.toString('hex'), 
                     "Hash": response.txHashHex, 
                     "SignatureHex": response.witness.witnessSignatureHex,
                     "SignatureString": signatureLedger.toString(),
                     "Verification": signatureLedger.verify(msg, publicKey)
                    });                     
//        console.log(Signature.fromHex(response.witness.witnessSignatureHex).toString())
//        console.log(Signature.fromHex(response.witness.witnessSignatureHex).toString())
    })
})
