import { expect } from "chai"
import { log } from "console"
import type { HexString,Uint64_str } from "types/internal"

import type Fio from "../../src/fio"
import { HARDENED } from "../../src/fio"
import type { Transaction } from "../../src/types/public"
import { hex_to_buf,uint64_to_buf } from "../../src/utils/serialize"
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
        const path = [44 + HARDENED, 235 + HARDENED, 0 + HARDENED, 0, 0]
        const privateKeyDHex = "4d597899db76e87933e7c6841c2d661810f070bad20487ef20eb84e182695a3a" as HexString
        const PrivateKey = require('@fioprotocol/fiojs/dist/ecc/key_private')
        const privateKey = PrivateKey(hex_to_buf(privateKeyDHex))
        const publicKey = privateKey.toPublic()
        console.log(publicKey.toUncompressed().toHex())

        //Let us prepare a transaction
        const tx: Transaction = { 
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
                amount: "19",
                max_fee: "1229782938247303441",
                tpid: "rewards@wallet",
                actor: "aftyershcu22",                                    
              }
            }],
            transaction_extensions: null,
        }
        const chainId = 'b20901380af44ef59c5918439a1f9a41d83669020319a80574b804a5f95cbd7e' as HexString;

        //We serialize the transaction
        const { TextEncoder, TextDecoder } = require('text-encoding');
        const fetch = require('node-fetch')
        const { base64ToBinary, arrayToHex } = require('@fioprotocol/fiojs/dist/chain-numeric');
        var ser = require("@fioprotocol/fiojs/dist/chain-serialize");
        
        const textDecoder = new TextDecoder();
        const textEncoder = new TextEncoder();

        const httpEndpoint = 'http://testnet.fioprotocol.io'
        const abiFioAddress = await (await fetch(httpEndpoint + '/v1/chain/get_abi', { body: `{"account_name": "fio.token"}`, method: 'POST' })).json();
        const rawAbi = await (await fetch(httpEndpoint + '/v1/chain/get_raw_abi', { body: `{"account_name": "fio.token"}`, method: 'POST' })).json()
        // Get a Map of all the types from fio.address
        var typesFioAddress = ser.getTypesFromAbi(ser.createInitialTypes(), abiFioAddress.abi);
        // Get the addaddress action type
        const actionAddaddress = typesFioAddress.get('trnsfiopubky');
        console.log(actionAddaddress)

        // Serialize the actions[] "data" field (This example assumes a single action, though transactions may hold an array of actions.)
        const buffer = new ser.SerialBuffer({ textEncoder, textDecoder });
        actionAddaddress.serialize(buffer, tx.actions[0].data);
        const serializedData = arrayToHex(buffer.asUint8Array())

        // Get the actions parameter from the transaction and replace the data field with the serialized data field
        var serializedAction = tx.actions[0] as any
        serializedAction = {
          ...serializedAction,
          data: serializedData
        };
        console.log(serializedAction)

        const rawTransaction = {
          ...tx,
          max_net_usage_words: 0x00,
          max_cpu_usage_ms: 0x00,
          delay_sec: 0x00,
          context_free_actions: [],
          actions: [serializedAction],     //Actions have to be an array
          transaction_extensions: [],
        }
        console.log(rawTransaction)

        const abiMsig = await (await fetch(httpEndpoint + '/v1/chain/get_abi', { body: `{"account_name": "eosio.msig"}`, method: 'POST' })).json()
        var typesTransaction = ser.getTypesFromAbi(ser.createInitialTypes(), abiMsig.abi)      
//        console.log(typesTransaction)
        // Get the transaction action type
        const txnaction = typesTransaction.get('transaction');
        console.log(txnaction)
        console.log(typesTransaction.get('transaction_header'));
        console.log(typesTransaction.get("action"))
        console.log(typesTransaction.get("permission_level"))
      
        // Serialize the transaction
        const buffer2 = new ser.SerialBuffer({ textEncoder, textDecoder });
        txnaction.serialize(buffer2, rawTransaction);
        const serializedTransaction = buffer2.asUint8Array()
        console.log(serializedTransaction)
        console.log(Buffer.from(serializedTransaction).toString("hex"))


        const serTx: Uint8Array = Buffer.from("1d312a6122116655443300000000010000980ad20ca85be0e1d195ba85e7cd012084460d5fe5f33200000000a8ed3232"/*"5d3546494f385052653457525a4a6a356d6b656d367156474b79764e466750734e6e6a4e4e366b50686836456143707a4356696e354a6a130000000000000011111111111111112084460d5fe5f3320e726577617264734077616c6c657400"*/, "hex")
        console.log(Buffer.from(serTx).toString("hex"))

/*        //Lets play with contracts
        const account = "fio.token"
        .getContract(account)*/



        //Lets compute its signature in using Signature.sign
        const Signature = require('@fioprotocol/fiojs/dist/ecc/signature');
        const msg = Buffer.concat([Buffer.from(chainId, "hex"), serTx, Buffer.allocUnsafe(32).fill(0)])

        const crypto = require("crypto")
        const signature = Signature.sign(msg, privateKey)
        console.log("Using Signature.sign")
        console.log({"msg": msg.toString('hex'), 
            "Hash": crypto.createHash('sha256').update(msg).digest('hex'), 
            "SignatureHex": signature.toHex(),
            "SignatureString": signature.toString(),
            "Verification": signature.verify(msg, publicKey),
        })                     
                     
        //Now lets do the same using signatureProvider.sign
        const { JsSignatureProvider } = require('@fioprotocol/fiojs/dist/chain-jssig')
        const signatureProvider = new JsSignatureProvider([PrivateKey.fromHex(privateKeyDHex).toString()])
        const requiredKeys = [publicKey.toString()]
        const serializedContextFreeData = null

        const signedTxn = await signatureProvider.sign({
            chainId: chainId,
            requiredKeys: requiredKeys,
            serializedTransaction: serializedTransaction,
            serializedContextFreeData: serializedContextFreeData,
        })

    
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
        const response = await fio.signTransaction({path, chainId, tx })
        const signatureLedger = Signature.fromHex(response.witness.witnessSignatureHex)
        console.log("Ledger Response")
        console.log(response)
        console.log("Using ledger toString")
        console.log({"msg": msg.toString('hex'), 
            "Hash": response.txHashHex, 
            "SignatureHex": response.witness.witnessSignatureHex,
            "SignatureString": signatureLedger.toString(),
            "Verification": signatureLedger.verify(msg, publicKey),
        })                     
        //        console.log(Signature.fromHex(response.witness.witnessSignatureHex).toString())
        //        console.log(Signature.fromHex(response.witness.witnessSignatureHex).toString())
    })
})
