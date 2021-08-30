/**
 * Reason for throwing [[InvalidData]] error.
 * @category Errors
 */
export enum InvalidDataReason {

  GET_EXT_PUB_KEY_PATHS_NOT_ARRAY = "ext pub key paths not an array",
  INVALID_PATH = "invalid path",
  CONTEXT_FREE_ACTIONS_NOT_SUPPORTED = "context free actions not supported",
  MULTIPLE_ACTIONS_NOT_SUPPORTED = "multiple actions not supported",
  ACTION_NOT_SUPPORTED = "action not suported",
  AMOUNT_INVALID = "amount invalid",
  MAX_FEE_INVALID = "max fee invalid",
  REF_BLOCK_NUM_INVALID = "ref block num invalid",
  REF_BLOCK_PREFIX_INVALID = "ref block prefix invalid",
  MULTIPLE_AUTHORIZATION_NOT_SUPPORTED = "multiple authorization not supported",
  NETWORK_INVALID_PROTOCOL_MAGIC = "invalid protocol magic",
  NETWORK_INVALID_NETWORK_ID = "invalid network id",
}
