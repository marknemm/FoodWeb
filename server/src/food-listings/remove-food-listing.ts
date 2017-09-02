/**
 * Removes a donated food listing and all assocaited claims for the given food listing.
 * @param foodListingKey The key identifier for the food listing that is to be removed.
 * @param donorAppUserKey The key identifier for the user who originally posted/donated the food listing.
 *                        Should be pulled from server session to ensure that the requestor is authorized to perform this action!
 * @return A promise that simply resolve on success without any payload.
 */
export function removeFoodListing(foodListingKey: number, donorAppUserKey: number): Promise<void> {
    // TODO.

    return Promise.resolve();
}