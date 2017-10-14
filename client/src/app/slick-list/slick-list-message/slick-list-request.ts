/**
 * Abstract base class for list filters. Contains retrieval range data for selecting only a limited segment of results from the server.
 * The list loads segments of data in a fashion similar to a Facebook news feed (using this data).
 */
export abstract class SlickListFilters {

    protected constructor (
        public retrievalOffset?: number,
        public retrievalAmount?: number
    ) { }
}


/**
 * (Base) class for a request object used to retrieve list data from the server.
 * Intended to be extended, but also can be used as is.
 */
export class SlickListRequest<FILTERS_T extends SlickListFilters> {

    public constructor (
        public filters?: FILTERS_T
    ) { }
}
