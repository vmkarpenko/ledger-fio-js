// Basic primitives
export type VarlenAsciiString = string & { __type: 'ascii' }
export type FixlenHexString<N> = string & { __type: 'hex', __length: N }
export type HexString = string & { __type: 'hex' }

export type _Uint64_num = number & { __type: 'uint64_t' }
export type _Uint64_bigint = bigint & { __type: 'uint64_t' }

export type ValidBIP32Path = Array<Uint32_t> & { __type: 'bip32_path' }
export type Uint64_str = string & { __type: 'uint64_t' }
export type Uint32_t = number & { __type: 'uint32_t' }
export type Uint16_t = number & { __type: 'uint16_t' }
export type Uint8_t = number & { __type: 'uint8_t' }

// Our types
export const PUBLIC_KEY_LENGTH = 65



export type ParsedTransferFIOTokensData = {
    payee_public_key: String,
    amount: Uint64_str,
    max_fee: Uint64_str,
    tpid: String,
    actor: String,
}
 export type ParsedActionAuthorisation = {
    actor: String,
    permission: String,
 }

 export type ParsedAction = {
    account: String,
    name: String,
    authorization: Array<ParsedActionAuthorisation>
    data: | ParsedTransferFIOTokensData
 }

export type ParsedTransaction = {
    expiration: String,
    ref_block_num: Uint32_t,
    ref_block_prefix: Uint16_t,
    context_free_actions: Array<ParsedAction>,
    actions: Array<ParsedAction>,
    transaction_extensions: null
}


