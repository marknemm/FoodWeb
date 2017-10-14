import { Observable } from "rxjs/Observable";

import { GetListingsService } from './get-listings.service';
import { SlickListFilters } from './slick-list-message/slick-list-request';
import { AbstractSlickListDialog } from "./slick-list-dialog/abstract-slick-list-dialog";


export abstract class AbstractSlickList <LIST_T, FILTERS_T extends SlickListFilters> {

    protected listData: Array<LIST_T>;
    protected selectedListIndex: number;

    protected slickListDialog: AbstractSlickListDialog;


    /**
     * A constructor that should only be accessed by child classes. This class is an abstract base class that should not be directly instantiated!
     * @param getListingsService The service used to get listings from the server (Can either e GetListingsService or a derived class).
     * @param ROUTE The route that will be used to fetch list data.
     */
    protected constructor (
        private getListingsService: GetListingsService<LIST_T, FILTERS_T>,
        private readonly ROUTE: string
    ) {
        // Initialize instance variables.
        this.listData = new Array<LIST_T>();
        this.selectedListIndex = null;

        // Setup callback (listener) for the retrieval of more listings.
        this.getListingsService.onGetMoreListings(this.onGetMoreListings.bind(this));
    }


    /**
     * Callback that is invoked by getListingsService whenever it has retrieved more listings due to scrolling near bottom of web page.
     * @param moreListings The additional listings that have been retrieved.
     */
    private onGetMoreListings(moreListings: Array<LIST_T>): void {
        this.listData = this.listData.concat(moreListings);
    }


    /**
     * Refreshes the listings using the new set of filters criteria. The offset used to retreive a certain range of listings will be reset to 0.
     * @param filters The filter criteria. 
     */
    public refreshList(filters: FILTERS_T): void {

        let observer: Observable<Array<LIST_T>> = this.getListingsService.getListings(filters, this.ROUTE);
        this.listData = new Array<LIST_T>(); // Empty our current model list while we wait for server results.

        observer.subscribe((listData: Array<LIST_T>) => {
            this.listData = listData;
        });
    }


    /**
     * Sets a given list item as selected and displays a set dialog if there is one.
     * @param selectedListIndex The index of the list item to select.
     * @param noDisplayDialog Default is false. Set to true if the set dialog should not be displayed upon selection.
     */
    public selectListing(selectedListIndex: number, noDisplayDialog: boolean = false): void {

        this.selectedListIndex = selectedListIndex;

        // If we wish to display the dialog and we have one set, then open it.
        if (!noDisplayDialog && this.slickListDialog != null) {
            this.slickListDialog.open();
        }
    }


    /**
     * Gets the selected listing.
     * @return The selected listing data.
     */
    public getSelectedListing(): LIST_T {

        if (this.selectedListIndex != null) {
            return this.listData[this.selectedListIndex];
        }
        return null;
    }


    /**
     * Removes the selected listing.
     */
    public removeSelectedListing(): void {

        // Close any modal details popup related to the listing we are deleting.
        if (this.slickListDialog != null && this.slickListDialog.isOpen()) {
            this.slickListDialog.close();
        }
        
        // Remove the listing from the contained array model.
        this.listData.splice(this.selectedListIndex, 1);
        this.selectedListIndex = null;
    }
}
