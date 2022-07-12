import { TransferFIOTokensData, RequestFundsData, RecordOtherBlockchainTransactionMetadata, MapBlockchainPublicAddress,
    PublicAddress, RemoveMappedAddress, NFT, MapNFTSignature, RemoveNFTSignature, SmallNFT, RemoveAllMappedAddresses,
    CancelFundsRequest, RejectFundsRequest, BuyBundledTransaction, RegisterAddress, TransferAddress, RegisterDomain,
    RenewDomain, MakeDomainPublic, TransferDomain, RemoveAllNFT, StakeFIO, UnstakeFIO, VoteOnBlockProducers,
    ProxyVotesToRegisteredProxy } from "fio";
import  { InvalidDataReason } from "../errors"
import {
    _Uint64_bigint,
    _Uint64_num,
    ParsedTransferFIOTokensData,
    ParsedRequestFundsData,
    ParsedRecordOtherBlockchainTransactionMetadata,
    PUBLIC_KEY_LENGTH,
    ParsedMapBlockchainPublicAddress,
    ParsedPublicAddress,
    ParsedRemoveAddress as ParsedRemoveMappedAddress,
    ParsedNFT,
    ParsedMapNFTSignature,
    ParsedRemoveNFTSignature,
    ParsedSmallNFT,
    ParsedRemoveAllMappedAddresses,
    ParsedCancelFundsRequest,
    ParsedRejectFundsRequest,
    ParsedBuyBundledTransaction,
    ParsedRegisterAddress,
    ParsedTransferAddress,
    ParsedRegisterDomain,
    ParsedRenewDomain,
    ParsedMakeDomainPublic,
    ParsedTransferDomain,
    ParsedRemoveAllNFT,
    ParsedStakeFIO,
    ParsedUnstakeFIO,
    ParsedVoteOnBlockProducers,
    VarlenAsciiString,
    ParsedProxyVotesToRegisteredProxy,
} from "../types/internal"
import { parseAscii, parseBoolean, parseHexString, parseNameString, parseUint64_str, validate } from "./parse";


export function parseActionDataTransferFIOToken(data: TransferFIOTokensData): ParsedTransferFIOTokensData {
    return {
        payee_public_key: parseAscii(data.payee_public_key, InvalidDataReason.INVALID_PAYEE_PUBKEY, 0, 64),
        amount: parseUint64_str(data.amount, {}, InvalidDataReason.INVALID_AMOUNT),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseNameString(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),
    }    
}


export function parseActionDataRequestFunds(data: RequestFundsData): ParsedRequestFundsData {    
    return {
        payer_fio_address: parseAscii(data.payer_fio_address, InvalidDataReason.INVALID_PAYER_FIO_ADDRESS, 3, 64),
        payee_fio_address: parseAscii(data.payee_fio_address, InvalidDataReason.INVALID_PAYEE_FIO_ADDRESS, 3, 64),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseAscii(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),

        payee_public_key: parseHexString(data.payee_public_key, InvalidDataReason.INVALID_PUBLIC_KEY, PUBLIC_KEY_LENGTH, PUBLIC_KEY_LENGTH),
        payee_public_address: parseAscii(data.payee_public_address, InvalidDataReason.INVALID_PAYEE_FIO_ADDRESS),
        amount: parseAscii(data.amount, InvalidDataReason.INVALID_AMOUNT),
        chain_code: parseAscii(data.chain_code, InvalidDataReason.INVALID_CHAIN_CODE, 1, 10),
        token_code: parseAscii(data.token_code, InvalidDataReason.INVALID_TOKEN_CODE, 1, 10),
        ...data.memo ? {memo: parseAscii(data.memo, InvalidDataReason.INVALID_MEMO)}:{},
        ...data.hash ? {hash: parseAscii(data.hash, InvalidDataReason.INVALID_HASH)}:{},
        ...data.offline_url ? {offline_url: parseAscii(data.offline_url, InvalidDataReason.INVALID_OFFLINE_URL)}:{},
    }
}

export function parseActionDataRecordOtherBlockchainTransactionMetadata(data: RecordOtherBlockchainTransactionMetadata): ParsedRecordOtherBlockchainTransactionMetadata {
    return {
        fio_request_id: parseAscii(data.fio_request_id, InvalidDataReason.INVALID_FIO_REQUEST_ID, 3, 64),
        payer_fio_address: parseAscii(data.payer_fio_address, InvalidDataReason.INVALID_PAYER_FIO_ADDRESS, 3, 64),
        payee_fio_address: parseAscii(data.payee_fio_address, InvalidDataReason.INVALID_PAYEE_FIO_ADDRESS, 3, 64),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseAscii(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),

        payee_public_key: parseHexString(data.payee_public_key, InvalidDataReason.INVALID_PUBLIC_KEY, PUBLIC_KEY_LENGTH, PUBLIC_KEY_LENGTH),
        payer_public_address: parseAscii(data.payer_public_address, InvalidDataReason.INVALID_PAYER_PUBLIC_ADDRESS),
        payee_public_address: parseAscii(data.payee_public_address, InvalidDataReason.INVALID_PAYEE_PUBLIC_ADDRESS),
        amount: parseAscii(data.amount, InvalidDataReason.INVALID_AMOUNT),
        chain_code: parseAscii(data.chain_code, InvalidDataReason.INVALID_CHAIN_CODE, 1, 10),
        token_code: parseAscii(data.token_code, InvalidDataReason.INVALID_TOKEN_CODE, 1, 10),
        status: parseAscii(data.status, InvalidDataReason.INVALID_STATUS),
        obt_id: parseAscii(data.obt_id, InvalidDataReason.INVALID_OBT_ID),
        ...data.memo ? {memo: parseAscii(data.memo, InvalidDataReason.INVALID_MEMO)}:{},
        ...data.hash ? {hash: parseAscii(data.hash, InvalidDataReason.INVALID_HASH)}:{},
        ...data.offline_url ? {offline_url: parseAscii(data.offline_url, InvalidDataReason.INVALID_OFFLINE_URL)}:{},
    }
}

function parsePublicAddress(a: PublicAddress): ParsedPublicAddress {
    return {
        chain_code: parseAscii(a.chain_code, InvalidDataReason.INVALID_CHAIN_CODE, 1, 10),
        token_code: parseAscii(a.token_code, InvalidDataReason.INVALID_TOKEN_CODE, 1, 10),
        public_address: parseAscii(a.public_address, InvalidDataReason.INVALID_TOKEN_CODE, 3, 64),
    }
}

function parsePublicAddsesses(a: Array<PublicAddress>): Array<ParsedPublicAddress> {
    validate(1 <= a.length && a.length <= 5, InvalidDataReason.INCORRECT_NUMBER_OF_PUBLIC_ADDRESSES)
    return a.map( e => parsePublicAddress(e))
}

export function parseMapBlockchainPublicAddress(data: MapBlockchainPublicAddress): ParsedMapBlockchainPublicAddress {
    return {
        fio_address: parseAscii(data.fio_address, InvalidDataReason.INVALID_FIO_ADDRESS, 3, 64),
        public_addresses: parsePublicAddsesses(data.public_addresses),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseNameString(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),
    }
}

export function parseRemoveMappedAddress(data: RemoveMappedAddress): ParsedRemoveMappedAddress {
    return {
        fio_address: parseAscii(data.fio_address, InvalidDataReason.INVALID_FIO_ADDRESS, 3, 64),
        public_addresses: parsePublicAddsesses(data.public_addresses),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseNameString(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),
    }
}

function parseNFT(a: NFT): ParsedNFT {
    return {
        chain_code: parseAscii(a.chain_code, InvalidDataReason.INVALID_CHAIN_CODE, 1, 10),
        contract_address: parseAscii(a.contract_address, InvalidDataReason.INVALID_TOKEN_CODE, 1, 128),
        token_id: parseAscii(a.token_id, InvalidDataReason.INVALID_TOKEN_CODE, 1, 64),
        url: parseAscii(a.url, InvalidDataReason.INVALID_TOKEN_CODE, 0, 128),
        hash: parseAscii(a.hash, InvalidDataReason.INVALID_TOKEN_CODE, 1, 64),
        metadata: parseAscii(a.metadata, InvalidDataReason.INVALID_TOKEN_CODE, 0, 128),
    }
}

function parseNFTs(a: Array<NFT>): Array<ParsedNFT> {
    validate(1 <= a.length && a.length <= 3, InvalidDataReason.INCORRECT_NUMBER_OF_NFTS)
    return a.map( e => parseNFT(e))
}

export function parseMapNFTSignature(data: MapNFTSignature): ParsedMapNFTSignature {
    return {
        fio_address: parseAscii(data.fio_address, InvalidDataReason.INVALID_FIO_ADDRESS, 3, 64),
        nfts: parseNFTs(data.nfts),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseNameString(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),
    }
}

function parseSmallNFT(a: SmallNFT): ParsedSmallNFT {
    return {
        chain_code: parseAscii(a.chain_code, InvalidDataReason.INVALID_CHAIN_CODE, 1, 10),
        contract_address: parseAscii(a.contract_address, InvalidDataReason.INVALID_TOKEN_CODE, 1, 128),
        token_id: parseAscii(a.token_id, InvalidDataReason.INVALID_TOKEN_CODE, 1, 64),
    }
}

function parseSmallNFTs(a: Array<SmallNFT>): Array<ParsedSmallNFT> {
    validate(1 <= a.length && a.length <= 3, InvalidDataReason.INCORRECT_NUMBER_OF_NFTS)
    return a.map( e => parseSmallNFT(e))
}

export function parseRemoveNFTSignature(data: RemoveNFTSignature): ParsedRemoveNFTSignature {
    return {
        fio_address: parseAscii(data.fio_address, InvalidDataReason.INVALID_FIO_ADDRESS, 3, 64),
        nfts: parseSmallNFTs(data.nfts),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseNameString(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),
    }
}

export function parseRemoveAllMappedAddresses(data: RemoveAllMappedAddresses): ParsedRemoveAllMappedAddresses {
    return {
        fio_address: parseAscii(data.fio_address, InvalidDataReason.INVALID_FIO_ADDRESS, 3, 64),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseNameString(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),
    }
}

export function parseCancelRequestFunds(data: CancelFundsRequest): ParsedCancelFundsRequest {    
    return {
        fio_request_id: parseAscii(data.fio_request_id, InvalidDataReason.INVALID_FIO_REQUEST_ID, 3, 64),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseAscii(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),
    }
}

export function parseRejectRequestFunds(data: RejectFundsRequest): ParsedRejectFundsRequest {    
    return {
        fio_request_id: parseAscii(data.fio_request_id, InvalidDataReason.INVALID_FIO_REQUEST_ID, 3, 64),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseAscii(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),
    }
}

export function parseBuyBundledTransaction(data: BuyBundledTransaction): ParsedBuyBundledTransaction {
    return {
        fio_address: parseAscii(data.fio_address, InvalidDataReason.INVALID_FIO_ADDRESS, 3, 64),
        bundle_sets: parseUint64_str(data.bundle_sets, {}, InvalidDataReason.INVALID_BUNDLE_SETS),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseNameString(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),
    }
}

export function parseRegisterAddress(data: RegisterAddress): ParsedRegisterAddress {
    return {
        fio_address: parseAscii(data.fio_address, InvalidDataReason.INVALID_FIO_ADDRESS, 3, 64),
        owner_fio_public_key: parseAscii(data.owner_fio_public_key, InvalidDataReason.INVALID_PUBLIC_KEY),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseNameString(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),
    }
}

export function parseTransferAddress(data: TransferAddress): ParsedTransferAddress {
    return {
        fio_address: parseAscii(data.fio_address, InvalidDataReason.INVALID_FIO_ADDRESS, 3, 64),
        new_owner_fio_public_key: parseAscii(data.new_owner_fio_public_key, InvalidDataReason.INVALID_PUBLIC_KEY),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseNameString(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),
    }
}

export function parseRegisterDomain(data: RegisterDomain): ParsedRegisterDomain {
    return {
        fio_domain: parseAscii(data.fio_domain, InvalidDataReason.INVALID_FIO_ADDRESS, 1, 62),
        owner_fio_public_key: parseAscii(data.owner_fio_public_key, InvalidDataReason.INVALID_PUBLIC_KEY),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseNameString(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),
    }
}

export function parseRenewDomain(data: RenewDomain): ParsedRenewDomain {
    return {
        fio_domain: parseAscii(data.fio_domain, InvalidDataReason.INVALID_FIO_ADDRESS, 1, 62),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseNameString(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),
    }
}

export function parseMakeDomainPublic(data: MakeDomainPublic): ParsedMakeDomainPublic {
    return {
        fio_domain: parseAscii(data.fio_domain, InvalidDataReason.INVALID_FIO_ADDRESS, 1, 62),
        is_public: parseBoolean(data.is_public, InvalidDataReason.INVALID_IS_PUBLIC),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseNameString(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),
    }
}

export function parseTransferDomain(data: TransferDomain): ParsedTransferDomain {
    return {
        fio_domain: parseAscii(data.fio_domain, InvalidDataReason.INVALID_FIO_ADDRESS, 1, 62),
        new_owner_fio_public_key: parseAscii(data.new_owner_fio_public_key, InvalidDataReason.INVALID_PUBLIC_KEY),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseNameString(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),
    }
}

export function parseRemoveAllNFT(data: RemoveAllNFT): ParsedRemoveAllNFT {
    return {
        fio_address: parseAscii(data.fio_address, InvalidDataReason.INVALID_FIO_ADDRESS, 3, 64),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseNameString(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),
    }
}

export function parseStakeFIO(data: StakeFIO): ParsedStakeFIO {
    return {
        amount: parseUint64_str(data.amount, {}, InvalidDataReason.INVALID_AMOUNT),
        fio_address: parseAscii(data.fio_address, InvalidDataReason.INVALID_FIO_ADDRESS, 3, 64),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseNameString(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),
    }
}

export function parseUnstakeFIO(data: UnstakeFIO): ParsedUnstakeFIO {
    return {
        amount: parseUint64_str(data.amount, {}, InvalidDataReason.INVALID_AMOUNT),
        fio_address: parseAscii(data.fio_address, InvalidDataReason.INVALID_FIO_ADDRESS, 3, 64),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseNameString(data.actor, InvalidDataReason.INVALID_ACTOR),
        tpid: parseAscii(data.tpid, InvalidDataReason.INVALID_TPID, 0, 20),
    }
}

function parseProducers(a: Array<string>): Array<VarlenAsciiString> {
    validate(1 <= a.length && a.length <= 30, InvalidDataReason.INCORRECT_NUMBER_OF_PRODUCERS)
    return a.map( e => parseAscii(e, InvalidDataReason.INVALID_PRODUCER, 3, 64))
}

export function parseVoteOnBlockProducers(data: VoteOnBlockProducers): ParsedVoteOnBlockProducers {
    return {
        producers: parseProducers(data.producers),
        fio_address: parseAscii(data.fio_address, InvalidDataReason.INVALID_FIO_ADDRESS, 3, 64),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseNameString(data.actor, InvalidDataReason.INVALID_ACTOR),
    }
}

export function parseProxyVotesToRegisteredProxy(data: ProxyVotesToRegisteredProxy): ParsedProxyVotesToRegisteredProxy {
    return {
        proxy: parseAscii(data.proxy, InvalidDataReason.INVALID_PROXY, 3, 64),
        fio_address: parseAscii(data.fio_address, InvalidDataReason.INVALID_FIO_ADDRESS, 3, 64),
        max_fee: parseUint64_str(data.max_fee, {}, InvalidDataReason.INVALID_MAX_FEE),
        actor: parseNameString(data.actor, InvalidDataReason.INVALID_ACTOR),
    }
}
