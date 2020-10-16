/**
 * Receiver information that is assocaited with `Receiver` type accounts on the platform.
 */
export interface Receiver {
  /**
   * The auto-generated integer ID for the receiver.
   */
  id?: number;
  /**
   * Whether or not the receiver shall automatically claim donations that are available to them.
   *
   * If set to `true`, then any donations that are within the receiver's spatial proximity which have a
   * pickup window that sufficiently overlaps with the receivers operation hours will be automatically claimed.
   * If the receiver has no operation hours set, then only spatial proximity is considered.
   * The receiver will still have the ability to manually claim donations.
   *
   * If set to `false`, then the receiver must manually claim donations.
   */
  autoReceiver: boolean;
}
