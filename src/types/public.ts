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
 * Represents BIP 32 path.
 * 
 * @example
 * ```
 *  const HD = HARDENED
 *  const ByronAccount0 = [44 + HD, 1815 + HD, 0 + HD];
 *  const ShelleyChangeAddress0 = [1852 + HD, 1815 + HD, 0 + HD, 1, 0]; 
 * ```
 * 
 * @see [[HARDENED]]
 * @category Basic types
 */
export type BIP32Path = Array<number>;

/**
 * Derived  public key
 * @category Basic types
 * @see [[Fio.getPublicKey]]
 */
 export type PublicKey = {
    publicKeyHex: string,
 }

/**
 * Device app flags
 * @category Basic types
 * @see [[Version]]
 */
 export type Flags = {
    isDebug: boolean,
};

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
    major: number,
    minor: number,
    patch: number,
    flags: Flags,
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
    serial: string,
};

