/**
 * Common SlickListDialog functionality.
 */
export interface SlickListDialogInterface {

    /**
     * Displays the listing details modal dialog.
     */
    open(): void;


    /**
     * Checks if the dialog is open.
     * @return true if the dialog is open, false if not.
     */
    isOpen(): boolean;


    /**
     * Hides (or closes) the listing details dialog.
     */
    close(): void;
}
