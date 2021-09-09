/**
 * Reason for throwing [[InvalidData]] error.
 * @category Errors
 */
export enum InvalidDataReason {
    GET_EXT_PUB_KEY_PATHS_NOT_ARRAY = "ext pub key paths not an array",
    INVALID_CHAIN_ID = "invalid chain id",
    INVALID_PATH = "invalid path",
    CONTEXT_FREE_ACTIONS_NOT_SUPPORTED = "context free actions not supported",
    MULTIPLE_ACTIONS_NOT_SUPPORTED = "multiple actions not supported",
    ACTION_NOT_SUPPORTED = "action not suported",
    AMOUNT_INVALID = "amount invalid",
    MAX_FEE_INVALID = "max fee invalid",
    INVALID_EXPIRATION = "invalid expiration",
    REF_BLOCK_NUM_INVALID = "ref block num invalid",
    REF_BLOCK_PREFIX_INVALID = "ref block prefix invalid",
    MULTIPLE_AUTHORIZATION_NOT_SUPPORTED = "multiple authorization not supported",
    ACTION_AUTHORIZATION_INVALID = "action authorization invalid",
    INVALID_PAYEE_PUBKEY = "invalid payee pubkey",
    INVALID_TPID = "invalid tpid",
    INVALID_ACTOR = "invalid actor",
    ACTION_DATA_TOO_LONG = "action data too long",
}
