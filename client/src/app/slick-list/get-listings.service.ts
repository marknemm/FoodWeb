"use strict";
import { Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RequestService, Response } from "../common-util/request.service";
import { SlickListRequest, SlickListFilters } from './slick-list-message/slick-list-request';
import { SlickListResponse } from './slick-list-message/slick-list-response';


@Injectable()
export class GetListingsService<LIST_T, FILTERS_T extends SlickListFilters> {
    
    private retrievalOffset: number;
    private noMoreListingsToRetrieve: boolean;

    private lastRoute: string;
    private lastFilters: FILTERS_T;

    private onGetMoreListingsCallback: (moreListings: Array<LIST_T>) => void;

    
    /**
     * @param requestService The Food Web App wrapper around http requests.
     * @param retrievalAmount Optional amount of items to be retrieved at a time. Default is 10.
     */
    public constructor (
        private requestService: RequestService,
        @Optional() private retrievalAmount: number = 10
    ) {
        this.retrievalOffset = 0;
        this.noMoreListingsToRetrieve = false;
        this.lastRoute = null;
        this.lastFilters = null;

        // Register our load more listings handler that fires when scrolling near bottom.
        window.onscroll = this.listenForLoadMoreListings.bind(this);
    }


    /**
     * Sets the callback function that is notified when more listings have been retrieved due to scrolling webpage near to bottom.
     * @param callback The callback function that will be set.
     */
    public onGetMoreListings(callback: (moreListings: Array<LIST_T>) => void) {
        this.onGetMoreListingsCallback = callback;
    }


    /**
     * Retrieves listings based off of optional filter criteria.
     * @param filters The filter criteria for selecting list data from the server.
     * @param route The route for selecting list data from the server.
     * @param getMoreListings Set to true if the server should get more listings to be diplayed, otherwise, it will get listings to replace
     *                        the current ones with (will start back at 0 retrieval offset).
     * @return An observable object that resolves to the list data response from the server (Empty if an error occured or no listings are available).
     */
    public getListings(filters: FILTERS_T, route: string, getMoreListings: boolean = false): Observable<Array<LIST_T>> {

        // Break out immediately if we are attempting to get more listings but have reached end!
        if (getMoreListings && !this.canGetMoreListings())  return;
        this.noMoreListingsToRetrieve = true; // We should not retrieve more listings until current request finished!

        // If we are simply getting more listings, then we will set the retrievalOffset to the beginning of next segment of entries.
        (getMoreListings) ? this.retrievalOffset += this.retrievalAmount
                          : this.retrievalOffset = 0;

        // Set our retrieval range information for the server to filter by.
        filters.retrievalOffset = this.retrievalOffset;
        filters.retrievalAmount = this.retrievalAmount;

        // Record the last route and filters used so we can make same call to get more listings with current criteria.
        this.lastRoute = route;
        this.lastFilters = filters;

        // Generate request and listen for a response.
        let request: SlickListRequest<FILTERS_T> = this.generateListingsRequest(filters);
        return this.requestService.post(route, request).map(this.mapResponseToDataList.bind(this));
    }


    /**
     * Listens for the user to scroll the listings near the bottom and then loads more listings.
     */
    private listenForLoadMoreListings(): void {

        // Break out immediately if we cannot get any more liistings right now.
        if (!this.canGetMoreListings())  return;

        // Determine offset of load more threshold in pixels from bottom of page.
        const THRESHOLD_OFFSET: number = 500;

        // Get the current bottom scroll position and the threshold for loading more.
        let currentScrollPosition: number = (window.scrollY + window.innerHeight);
        let loadThresholdPosition: number = (document.body.offsetHeight - THRESHOLD_OFFSET);

        // If we are near the bottom of the page, then load more listings!
        if (this.lastFilters != null && (currentScrollPosition >= loadThresholdPosition)) {
            
            let observer: Observable<Array<LIST_T>> = this.getListings(this.lastFilters, this.lastRoute, true);
            
            // Concatenate the resulting listings that come back!
            observer.subscribe((listData: Array<LIST_T>) => {
                if (this.onGetMoreListingsCallback != null) {
                    this.onGetMoreListingsCallback(listData)   
                }
            });
        }
    }


    /**
     * Determines whether or not more listings can be retrieved (if we have reached end or not).
     * @return true if more listings are available for retrieval, false if not.
     */
    private canGetMoreListings(): boolean {
        return (!this.noMoreListingsToRetrieve && this.lastFilters != null && this.lastRoute != null);
    }


    /**
     * Method that can be overriden by child class. Generates the final request object that will be JSON-ified and sent to the server.
     * The request object must either be SlickListRequest or by a subclass of it. Default is a basic SlickListRequest object.
     * @param filters The filter criteria used when retrieving listings.
     * @return The final request that will be sent to the server.
     */
    protected generateListingsRequest(filters: FILTERS_T): SlickListRequest<FILTERS_T> {
        return new SlickListRequest<FILTERS_T>(filters);
    }


    /**
     * Maps the response from the server to the expected data list.
     * @param response The response from the server, which on success contains the expected list of data.
     * @return On success, the filled data list (may be empty). On failure, an empty data list.
     */
    private mapResponseToDataList(response: Response): Array<LIST_T> {

        let getListingsResponse: SlickListResponse<LIST_T> = response.json();
        let listData: Array<LIST_T> = getListingsResponse.listData;
        console.log(getListingsResponse.message);

        // If no Food Listings came back, then there are no more to retrieve with current criteria.
        console.log('Got ' + listData.length + ' listings out of possible ' + this.retrievalAmount);
        this.noMoreListingsToRetrieve = (listData == null || listData.length < this.retrievalAmount);

        if (getListingsResponse.success) {
            return listData;
        }

        // If the response success flag is false, then we will simply send back an empty array to the calling component.
        return new Array<LIST_T>();
    }
}
