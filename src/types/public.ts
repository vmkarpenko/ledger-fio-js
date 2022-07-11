import fiojs from "@fioprotocol/fiojs"
import { PublicKeyInput } from "crypto"
/**
 * Type for 64-bit integers.
 *
 * We accept either
 * - `Number` (if it is less than Number.MAX_SAFE_INTEGER)
 * - `String` (representing 64-bit number)
 * - `BigInt` (if platform supports it natively)
 * @category Basic types
 */
export type bigint_like = number | bigint | string

// Blockchain-defined constants

/**
 * Hardened derivation
 *
 * @example
 * ```
 * const accountId = 0 + HARDENED
 * ```
 *
 * @see [[BIP32Path]]
 */
export const HARDENED = 0x80000000

// Our types

/**
 * Device app flags
 * @category Basic types
 * @see [[Version]]
 */
export type Flags = {
    isDebug: boolean
}

/**
 * Describes compatibility of device with current SDK
 * @category Basic types
 * @see [[Fio.getVersion]]
 */
export type DeviceCompatibility = {
    /** Overall compatibility.
     * - true if SDK supports the device with given firmware version (to the
     *   extent of the features supported by the firmware itself)
     * - false if SDK refuses to communicate with current device version
     */
    isCompatible: boolean
    /**
     * In case there are some compatibility problem, SDK recommended version.
     * Clients of SDK should check whether this is null and if not, urge users to upgrade.
     */
    recommendedVersion: string | null
}

/**
 * Device app version
 * @category Basic types
 * @see [[Fio.getVersion]]
 * @see [[DeviceCompatibility]]
 */
export type Version = {
    major: number
    minor: number
    patch: number
    flags: Flags
};

/**
 * Response to [[Fio.getSerial]] call
 * @category Basic types
 */
export type Serial = {
    /**
     * Serial is a Ledger device identifier.
     * It is 7 bytes long, which is represented here as 14-character hex string
     */
    serial: string
};

/**
 * Represents BIP 32 path.
 *
 * @example
 * ```
 *  const HD = HARDENED
 *  const Address = [44 + HD, 1815 + HD, 0 + HD, 0, 0];
 * ```
 *
 * @see [[HARDENED]]
 * @category Basic types
 */
export type BIP32Path = Array<number>


/**
 * Transaction witness.
 * @see [[SignedTransactionData]]
 * @category Basic types
 */
export type Witness = {
    /**
     * Witnessed path
     */
    path: BIP32Path
    /**
     * Note: this is *only* a signature.
     * You need to add proper extended public key to form a full witness
     */
    witnessSignatureHex: string
};

/**
 * Result of signing a transaction.
 * @category Basic types
 * @see [[Fio.signTransaction]]
 */
export type SignedTransactionData = {
    /**
     * If the transaction involves DH encryption, the data is here (base64 encoding), otherwise, this string is empty
     */
     dhEncryptedData: string
    /**
     * Hash of signed transaction. Callers should check that they serialize tx the same way
     */
     txHashHex: string
    /**
     * List of witnesses. Caller should assemble full transaction to be submitted to the network.
     */
    witness: Witness
};


/**
 * Represents Transfer FIO Tokens trnsfiopubkey data.
 * @category Basic types
 * @see [[Action]]
 */
export type TransferFIOTokensData = {
    payee_public_key: string
    amount: bigint_like
    max_fee: bigint_like
    tpid: string
    actor: string
}

/**
 * Represents Request Funds newfundsreq data.
 * @category Basic types
 * @see [[Action]]
 */
 export type RequestFundsData = {
    payer_fio_address: string
    payee_fio_address: string
    max_fee: bigint_like
    actor: string
    tpid: string

    /**
     * Payee public key - needed for DH encryprion. In uncomressed format as hex string.
     */
    payee_public_key: string
    //content
    payee_public_address: string
    amount: string
    chain_code: string
    token_code: string
    memo?: string
    hash?: string
    offline_url?: string
}

/**
 * Represents Record Other Blockchain Transaction Metadata recordobt data.
 * @category Basic types
 * @see [[Action]]
 */
 export type RecordOtherBlockchainTransactionMetadata = {
    fio_request_id: string
    payer_fio_address: string
    payee_fio_address: string
    max_fee: bigint_like
    actor: string
    tpid: string

    /**
     * Payee public key - needed for DH encryprion. In uncomressed format as hex string.
     */
    payee_public_key: string
    //content
    payee_public_address: string
    payer_public_address: string
    amount: string
    chain_code: string
    token_code: string
    status: string
    obt_id: string
    memo?: string
    hash?: string
    offline_url?: string
}

/**
 * Represents Public addresses .
 * @category Basic types
 * @see [[Action]]
 */
 export type PublicAddress = {
    chain_code: string
    token_code: string
    public_address: string
 }

/**
 * Represents Map blockchain public address data.
 * @category Basic types
 * @see [[Action]]
 */
 export type MapBlockchainPublicAddress = {
    fio_address: string
    public_addresses: Array<PublicAddress>
    max_fee: bigint_like
    actor: string
    tpid: string
}

/**
 * Represents Remove mapped address data.
 * @category Basic types
 * @see [[Action]]
 */
 export type RemoveMappedAddress = {
    fio_address: string
    public_addresses: Array<PublicAddress>
    max_fee: bigint_like
    actor: string
    tpid: string
}

/**
 * Represents NFT for addnft.
 * @category Basic types
 * @see [[Action]]
 */
 export type NFT = {
    chain_code: string
    contract_address: string
    token_id: string
    url: string
    hash: string
    metadata: string
 }

 /**
 * Represents NFT for remnft.
 * @category Basic types
 * @see [[Action]]
 */
  export type SmallNFT = {
    chain_code: string
    contract_address: string
    token_id: string
 }

 /**
 * Represents Map NFT Signature to a FIO Crypto Handle data.
 * @category Basic types
 * @see [[Action]]
 */
 export type MapNFTSignature = {
    fio_address: string
    nfts: Array<NFT>
    max_fee: bigint_like
    actor: string
    tpid: string
}

/**
 * Remove NFT Signature from FIO Crypto Handle data.
 * @category Basic types
 * @see [[Action]]
 */
 export type RemoveNFTSignature = {
    fio_address: string
    nfts: Array<SmallNFT>
    max_fee: bigint_like
    actor: string
    tpid: string
}

/**
 * Remove all mapped addresses data.
 * @category Basic types
 * @see [[Action]]
 */
 export type RemoveAllMappedAddresses = {
    fio_address: string
    max_fee: bigint_like
    actor: string
    tpid: string
}

/**
 * Cancel Funds Request data.
 * @category Basic types
 * @see [[Action]]
 */
 export type CancelFundsRequest = {
    fio_request_id: string
    max_fee: bigint_like
    actor: string
    tpid: string
}

/**
 * Reject Funds Request data.
 * @category Basic types
 * @see [[Action]]
 */
 export type RejectFundsRequest = {
    fio_request_id: string
    max_fee: bigint_like
    actor: string
    tpid: string
}

/**
 * Buy bundled ransaction data.
 * @category Basic types
 * @see [[Action]]
 */
 export type BuyBundledTransaction = {
    fio_address: string
    bundle_sets: bigint_like
    max_fee: bigint_like
    actor: string
    tpid: string
}

/**
 * Register address data.
 * @category Basic types
 * @see [[Action]]
 */
 export type RegisterAddress = {
    fio_address: string
    owner_fio_public_key: string
    max_fee: bigint_like
    actor: string
    tpid: string
}

/**
 * Transfer address data.
 * @category Basic types
 * @see [[Action]]
 */
 export type TransferAddress = {
    fio_address: string
    new_owner_fio_public_key: string
    max_fee: bigint_like
    actor: string
    tpid: string
}

/**
 * Register domain data.
 * @category Basic types
 * @see [[Action]]
 */
 export type RegisterDomain = {
    fio_domain: string
    owner_fio_public_key: string
    max_fee: bigint_like
    actor: string
    tpid: string
}

/**
 * Renew domain data.
 * @category Basic types
 * @see [[Action]]
 */
 export type RenewDomain = {
    fio_domain: string
    max_fee: bigint_like
    actor: string
    tpid: string
}

/**
 * Make domain public data.
 * @category Basic types
 * @see [[Action]]
 */
 export type MakeDomainPublic = {
    fio_domain: string
    is_public: bigint_like
    max_fee: bigint_like
    actor: string
    tpid: string
}


/**
 * Transfer domain data.
 * @category Basic types
 * @see [[Action]]
 */
 export type TransferDomain = {
    fio_domain: string
    new_owner_fio_public_key: string
    max_fee: bigint_like
    actor: string
    tpid: string
}

/**
 * RemoveAllNFT data.
 * @category Basic types
 * @see [[Action]]
 */
 export type RemoveAllNFT = {
    fio_address: string
    max_fee: bigint_like
    actor: string
    tpid: string
}

/**
 * Stake fio data.
 * @category Basic types
 * @see [[Action]]
 */
 export type StakeFIO = {
    amount: bigint_like
    fio_address: string
    max_fee: bigint_like
    actor: string
    tpid: string
}

/**
 * Unstake fio data.
 * @category Basic types
 * @see [[Action]]
 */
 export type UnstakeFIO = {
    amount: bigint_like
    fio_address: string
    max_fee: bigint_like
    actor: string
    tpid: string
}

/**
 * Vote on block producers data.
 * @category Basic types
 * @see [[Action]]
 */
 export type VoteOnBlockProducers = {
    producers: Array<string>
    fio_address: string
    max_fee: bigint_like
    actor: string
}

/**
 * Proxy votes to registred proxy data.
 * @category Basic types
 * @see [[Action]]
 */
 export type ProxyVotesToRegisteredProxy = {
    proxy: string
    fio_address: string
    max_fee: bigint_like
    actor: string
}

/**
 * Represents authorisation in transaction Actions.
 * @category Basic types
 * @see [[Action]]
 */
export type ActionAuthorisation = {
    actor: string
    permission: string
}


/**
 * Represents actions in the transaction.
 * @category Basic types
 * @see [[Transaction]]
 */
export type Action = {
    account: string
    name: string
    authorization: Array<ActionAuthorisation>
    data: 
        TransferFIOTokensData | 
        RequestFundsData | 
        RecordOtherBlockchainTransactionMetadata |
        MapBlockchainPublicAddress |
        RemoveMappedAddress |
        MapNFTSignature |
        RemoveNFTSignature |
        RemoveAllMappedAddresses |
        CancelFundsRequest |
        RejectFundsRequest |
        BuyBundledTransaction |
        RegisterAddress |
        TransferAddress |
        RegisterDomain |
        RenewDomain |
        MakeDomainPublic |
        TransferDomain |
        RemoveAllNFT |
        StakeFIO |
        UnstakeFIO |
        VoteOnBlockProducers |
        ProxyVotesToRegisteredProxy
}


/**
 * Represents transaction to be signed by the device.
 * Note that this represents a *superset* of what Ledger can sign due to certain hardware app/security limitations.
 * @category Basic types
 * @see [[Fio.signTransaction]]
 */
export type Transaction = {
    expiration: string
    ref_block_num: bigint_like
    ref_block_prefix: bigint_like
    context_free_actions: Array<Action>
    actions: Array<Action>
    transaction_extensions: Array<any>
}
