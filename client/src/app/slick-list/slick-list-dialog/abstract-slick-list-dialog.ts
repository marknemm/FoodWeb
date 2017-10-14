/**
 * Handles implementations of opening and closing dialog. Simply need to assign an actual implementation of SlickListDialogInterface to slickListDialog member.
 * This can be done by redeclaring it in the child as a view child (and the view child can be SlickListDialogComponent).
 */
export abstract class AbstractSlickListDialog {

    protected slickListDialog: AbstractSlickListDialog; 

    
    protected constructor()
    { }


    /**
     * Displays the listing details modal dialog.
     */
    public open(): void {
        if (this.slickListDialog != null)  this.slickListDialog.open();
    }


    /**
     * Checks if the dialog is open.
     * @return true if the dialog is open, false if not.
     */
    public isOpen(): boolean {
        return (this.slickListDialog != null) ? this.slickListDialog.isOpen()
                                              : false;
    }


    /**
     * Hides (or closes) the listing details dialog.
     */
    public close(): void {
        if (this.slickListDialog != null)  this.slickListDialog.close();
    }
}
