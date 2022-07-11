// Basic primitives
export type VarlenAsciiString = string & { __type: 'ascii' }
export type FixlenHexString<N> = string & { __type: 'hex', __length: N }
export type NameString = FixlenHexString<16>
export type HexString = string & { __type: 'hex' }
export type Base64String = string & { __type: 'base64' }

export type _Uint64_num = number & { __type: 'uint64_t' }
export type _Uint64_bigint = bigint & { __type: 'uint64_t' }

export type ValidBIP32Path = Array<Uint32_t> & { __type: 'bip32_path' }
export type Uint64_str = string & { __type: 'uint64_t' }
export type Uint32_t = number & { __type: 'uint32_t' }
export type Uint16_t = number & { __type: 'uint16_t' }
export type Uint8_t = number & { __type: 'uint8_t' }

// Our types
export const PUBLIC_KEY_LENGTH = 65
export const WIF_PUBLIC_KEY_LENGTH = 53

export type ParsedTransferFIOTokensData = {
    payee_public_key: VarlenAsciiString
    amount: Uint64_str
    max_fee: Uint64_str
    tpid: VarlenAsciiString
    actor: NameString
}

export type ParsedRequestFundsData = {
    payer_fio_address: VarlenAsciiString
    payee_fio_address: VarlenAsciiString
    max_fee: Uint64_str
    actor: VarlenAsciiString
    tpid: VarlenAsciiString

    //we need this to start DH encryption - 
    payee_public_key: HexString
    //content
    payee_public_address: VarlenAsciiString
    amount: VarlenAsciiString
    chain_code: VarlenAsciiString
    token_code: VarlenAsciiString
    memo?: VarlenAsciiString
    hash?: VarlenAsciiString
    offline_url?: VarlenAsciiString
}

export type ParsedRecordOtherBlockchainTransactionMetadata = {
    fio_request_id: VarlenAsciiString
    payer_fio_address: VarlenAsciiString
    payee_fio_address: VarlenAsciiString
    max_fee: Uint64_str
    actor: VarlenAsciiString
    tpid: VarlenAsciiString

    //we need this to start DH encryption
    payee_public_key: HexString
    //content
    payee_public_address: VarlenAsciiString
    payer_public_address: VarlenAsciiString
    amount: VarlenAsciiString
    chain_code: VarlenAsciiString
    token_code: VarlenAsciiString
    status: VarlenAsciiString
    obt_id: VarlenAsciiString
    memo?: VarlenAsciiString
    hash?: VarlenAsciiString
    offline_url?: VarlenAsciiString
}

export type ParsedPublicAddress = {
    chain_code: VarlenAsciiString
    token_code: VarlenAsciiString
    public_address: VarlenAsciiString
}

export type ParsedMapBlockchainPublicAddress = {
    fio_address: VarlenAsciiString
    public_addresses: Array<ParsedPublicAddress>
    max_fee: Uint64_str
    actor: NameString
    tpid: VarlenAsciiString
}

export type ParsedRemoveAddress = {
    fio_address: VarlenAsciiString
    public_addresses: Array<ParsedPublicAddress>
    max_fee: Uint64_str
    actor: NameString
    tpid: VarlenAsciiString
}

export type ParsedNFT = {
    chain_code: VarlenAsciiString
    contract_address: VarlenAsciiString
    token_id: VarlenAsciiString
    url: VarlenAsciiString
    hash: VarlenAsciiString
    metadata: VarlenAsciiString
}

export type ParsedMapNFTSignature = {
    fio_address: VarlenAsciiString
    nfts: Array<ParsedNFT>
    max_fee: Uint64_str
    actor: NameString
    tpid: VarlenAsciiString
}

export type ParsedSmallNFT = {
    chain_code: VarlenAsciiString
    contract_address: VarlenAsciiString
    token_id: VarlenAsciiString
}

export type ParsedRemoveNFTSignature = {
    fio_address: VarlenAsciiString
    nfts: Array<ParsedSmallNFT>
    max_fee: Uint64_str
    actor: NameString
    tpid: VarlenAsciiString
}

export type ParsedRemoveAllMappedAddresses = {
    fio_address: VarlenAsciiString
    max_fee: Uint64_str
    actor: NameString
    tpid: VarlenAsciiString
}

export type ParsedCancelFundsRequest = {
    fio_request_id: VarlenAsciiString
    max_fee: Uint64_str
    actor: VarlenAsciiString
    tpid: VarlenAsciiString
}

export type ParsedRejectFundsRequest = {
    fio_request_id: VarlenAsciiString
    max_fee: Uint64_str
    actor: VarlenAsciiString
    tpid: VarlenAsciiString
}

export type ParsedBuyBundledTransaction = {
    fio_address: VarlenAsciiString
    bundle_sets: Uint64_str
    max_fee: Uint64_str
    actor: NameString
    tpid: VarlenAsciiString
}

export type ParsedRegisterAddress = {
    fio_address: VarlenAsciiString
    owner_fio_public_key: VarlenAsciiString
    max_fee: Uint64_str
    actor: NameString
    tpid: VarlenAsciiString
}

export type ParsedTransferAddress = {
    fio_address: VarlenAsciiString
    new_owner_fio_public_key: VarlenAsciiString
    max_fee: Uint64_str
    actor: NameString
    tpid: VarlenAsciiString
}

export type ParsedRegisterDomain = {
    fio_domain: VarlenAsciiString
    owner_fio_public_key: VarlenAsciiString
    max_fee: Uint64_str
    actor: NameString
    tpid: VarlenAsciiString
}

export type ParsedRenewDomain = {
    fio_domain: VarlenAsciiString
    max_fee: Uint64_str
    actor: NameString
    tpid: VarlenAsciiString
}

export type ParsedMakeDomainPublic = {
    fio_domain: VarlenAsciiString
    is_public: boolean
    max_fee: Uint64_str
    actor: NameString
    tpid: VarlenAsciiString
}

export type ParsedTransferDomain = {
    fio_domain: VarlenAsciiString
    new_owner_fio_public_key: VarlenAsciiString
    max_fee: Uint64_str
    actor: NameString
    tpid: VarlenAsciiString
}

export type ParsedRemoveAllNFT = {
    fio_address: VarlenAsciiString
    max_fee: Uint64_str
    actor: NameString
    tpid: VarlenAsciiString
}

export type ParsedStakeFIO = {
    fio_address: VarlenAsciiString
    amount: Uint64_str
    max_fee: Uint64_str
    actor: NameString
    tpid: VarlenAsciiString
}

export type ParsedUnstakeFIO = {
    fio_address: VarlenAsciiString
    amount: Uint64_str
    max_fee: Uint64_str
    actor: NameString
    tpid: VarlenAsciiString
}

export type ParsedVoteOnBlockProducers = {
    producers: Array<VarlenAsciiString>
    fio_address: VarlenAsciiString
    max_fee: Uint64_str
    actor: NameString
}

 export type ParsedProxyVotesToRegisteredProxy = {
    proxy: VarlenAsciiString
    fio_address: VarlenAsciiString
    max_fee: Uint64_str
    actor: NameString
}

export type ParsedActionAuthorisation = {
    actor: NameString
    permission: NameString
}

export type ParsedActionData = 
    ParsedTransferFIOTokensData | 
    ParsedRequestFundsData | 
    ParsedRecordOtherBlockchainTransactionMetadata |
    ParsedMapBlockchainPublicAddress |
    ParsedRemoveAddress |
    ParsedMapNFTSignature |
    ParsedRemoveNFTSignature |
    ParsedRemoveAllMappedAddresses |
    ParsedCancelFundsRequest |
    ParsedRejectFundsRequest |
    ParsedRegisterAddress |
    ParsedTransferAddress |
    ParsedBuyBundledTransaction |
    ParsedRegisterDomain |
    ParsedRenewDomain |
    ParsedMakeDomainPublic |
    ParsedTransferDomain |
    ParsedRemoveAllNFT |
    ParsedStakeFIO |
    ParsedUnstakeFIO |
    ParsedVoteOnBlockProducers |
    ParsedProxyVotesToRegisteredProxy

export type ParsedAction = {
    account: NameString
    name: NameString
    authorization: Array<ParsedActionAuthorisation>
    data: ParsedActionData
}

export type ParsedTransaction = {
    expiration: string
    ref_block_num: Uint16_t
    ref_block_prefix: Uint32_t
    context_free_actions: Array<ParsedAction>
    actions: Array<ParsedAction>
    transaction_extensions: null
}

export enum ParsedContext {
    NEWFUNDSREQ = 1,
    RECORDOT = 2,
}
