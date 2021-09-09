import {expect} from "chai"
import {parseTransaction} from "../../src/utils/parse"
import {Transaction} from "../../src/types/public"
import {InvalidDataReason} from "../../src/errors"

const chainId = "" //XXX

const validTx: Transaction = {
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

const invalidExpiration = JSON.parse(JSON.stringify(validTx))
invalidExpiration.expiration = null

const invalidRefBlockNum = JSON.parse(JSON.stringify(validTx))
invalidRefBlockNum.ref_block_num = null

const invalidRefBlockPrefix = JSON.parse(JSON.stringify(validTx))
invalidRefBlockPrefix.ref_block_prefix = null

const someContextFreeActions = JSON.parse(JSON.stringify(validTx))
someContextFreeActions.context_free_actions = ["A", "B"]

const noActions = JSON.parse(JSON.stringify(validTx))
noActions.actions = []

const moreThanOneAction = JSON.parse(JSON.stringify(validTx))
moreThanOneAction.actions.push(moreThanOneAction.actions[0])

const invalidAccount = JSON.parse(JSON.stringify(validTx))
invalidAccount.actions[0].account = null

const invalidName = JSON.parse(JSON.stringify(validTx))
invalidName.actions[0].name = null

const noAuthorization = JSON.parse(JSON.stringify(validTx))
noAuthorization.actions[0].authorization = []

const moreThanOneAuthorization = JSON.parse(JSON.stringify(validTx))
moreThanOneAuthorization.actions[0].authorization
    .push(moreThanOneAuthorization.actions[0].authorization[0])

const invalidActor = JSON.parse(JSON.stringify(validTx))
invalidActor.actions[0].authorization[0].actor = null

const invalidPermission = JSON.parse(JSON.stringify(validTx))
invalidPermission.actions[0].authorization[0].permission = null

const invalidPayeePublicKey = JSON.parse(JSON.stringify(validTx))
invalidPayeePublicKey.actions[0].data.payee_public_key = null

const invalidAmount = JSON.parse(JSON.stringify(validTx))
invalidAmount.actions[0].data.amount = null

const invalidMaxFee = JSON.parse(JSON.stringify(validTx))
invalidMaxFee.actions[0].data.max_fee = null

const invalidTpid = JSON.parse(JSON.stringify(validTx))
invalidTpid.actions[0].data.tpid = null

const invalidActionDataActor = JSON.parse(JSON.stringify(validTx))
invalidActionDataActor.actions[0].data.actor = null

describe("parse", () => {
    describe("parseTransaction", () => {
        it("successfully parse valid transaction", () => {
            expect(() => parseTransaction(chainId, validTx)).to.not.throw()
        })

        it("fail to parse incorrect expiration", () => {
            expect(() => parseTransaction(chainId, invalidExpiration))
                .to.throw(InvalidDataReason.INVALID_EXPIRATION)
        })

        it("fail to parse incorrect ref_block_num", () => {
            expect(() => parseTransaction(chainId, invalidRefBlockNum))
                .to.throw(InvalidDataReason.INVALID_REF_BLOCK_NUM)
        })

        it("fail to parse incorrect ref_block_prefix", () => {
            expect(() => parseTransaction(chainId, invalidRefBlockPrefix))
                .to.throw(InvalidDataReason.INVALID_REF_BLOCK_PREFIX)
        })

        it("fail to parse when there are context free actions", () => {
            expect(() => parseTransaction(chainId, someContextFreeActions))
                .to.throw(InvalidDataReason.CONTEXT_FREE_ACTIONS_NOT_SUPPORTED)
        })

        it("fail to parse when there are no actions", () => {
            expect(() => parseTransaction(chainId, noActions))
                .to.throw(InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED)
        })

        it("fail to parse when there is more than one action", () => {
            expect(() => parseTransaction(chainId, moreThanOneAction))
                .to.throw(InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED)
        })

        it("fail to parse invalid account", () => {
            expect(() => parseTransaction(chainId, invalidAccount))
                .to.throw(InvalidDataReason.INVALID_ACCOUNT)
        })

        it("fail to parse invalid name", () => {
            expect(() => parseTransaction(chainId, invalidName))
                .to.throw(InvalidDataReason.INVALID_NAME)
        })

        it("fail to parse when there is no authorization", () => {
            expect(() => parseTransaction(chainId, noAuthorization))
                .to.throw(InvalidDataReason.MULTIPLE_AUTHORIZATION_NOT_SUPPORTED)
        })

        it("fail to parse when there is more than one authorization", () => {
            expect(() => parseTransaction(chainId, moreThanOneAuthorization))
                .to.throw(InvalidDataReason.MULTIPLE_AUTHORIZATION_NOT_SUPPORTED)
        })

        it("fail to parse invalid actor", () => {
            expect(() => parseTransaction(chainId, invalidActor))
                .to.throw(InvalidDataReason.INVALID_ACTOR)
        })

        it("fail to parse invalid permission", () => {
            expect(() => parseTransaction(chainId, invalidPermission))
                .to.throw(InvalidDataReason.INVALID_PERMISSION)
        })

        it("fail to parse invalid payee public key", () => {
            expect(() => parseTransaction(chainId, invalidPayeePublicKey))
                .to.throw(InvalidDataReason.INVALID_PAYEE_PUBKEY)
        })

        it("fail to parse invalid amount", () => {
            expect(() => parseTransaction(chainId, invalidAmount))
                .to.throw(InvalidDataReason.INVALID_AMOUNT)
        })

        it("fail to parse invalid max fee", () => {
            expect(() => parseTransaction(chainId, invalidMaxFee))
                .to.throw(InvalidDataReason.INVALID_MAX_FEE)
        })

        it("fail to parse invalid tpid", () => {
            expect(() => parseTransaction(chainId, invalidTpid))
                .to.throw(InvalidDataReason.INVALID_TPID)
        })

        it("fail to parse invalid actor in action data", () => {
            expect(() => parseTransaction(chainId, invalidActionDataActor))
                .to.throw(InvalidDataReason.INVALID_ACTOR)
        })
    })
})
