import { Component, ContentChild, EventEmitter, Input, Output } from '@angular/core';
import { IonVirtualScroll } from '@ionic/angular';
import { ListLoadMoreEvent, ListRefreshEvent } from '~hybrid/filtered-list/interfaces/list-refresh-event';
import { FilteredListComponent as WebFilteredListComponent } from '~web/filtered-list/child-components/filtered-list/filtered-list.component';

@Component({
  selector: 'foodweb-hybrid-filtered-list',
  templateUrl: './filtered-list.component.html',
  styleUrls: ['./filtered-list.component.scss']
})
export class FilteredListComponent extends WebFilteredListComponent {

  @Input() loadMoreDisabled = false;
  @Input() pageSize = 10;
  @Input() refreshDisabled = false;
  @Input() threshold = '100px';

  @Output() refresh = new EventEmitter<ListRefreshEvent>();
  @Output() loadMore = new EventEmitter<ListLoadMoreEvent>();

  @ContentChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;

  private _page = 1;
  private _itemCount = 0;
  private _noMoreItems = false;

  get noMoreItems(): boolean {
    return this._noMoreItems;
  }

  get page(): number {
    return this._page;
  }

  /**
   * Handles an ionRefresh event by refreshing the Donation Hub List items.
   * @param event The ionRefresh event.
   */
  handleIonRefresh(event: any): void {
    if (!this.refreshDisabled) {
      this._page = 1;
      this.refresh.emit({
        complete: () => {
          this._itemCount = 0;
          this._noMoreItems = false;
          return this._complete(event);
        }
      });
    }
  }

  /**
   * Handles an ionInfinite event by loading the next segment of Donation Hub List items.
   * @param event The ionInfinite event.
   */
  handleIonInfinite(event: any): void {
    if (!this.loadMoreDisabled) {
      this.loadMore.emit({
        complete: () => this._complete(event),
        page: ++this._page
      });
    }
  }

  private _complete(event: any): Promise<void> {
    if (this.virtualScroll) {
      this.virtualScroll.checkEnd();
      setTimeout(() => {
        this._noMoreItems = (this._itemCount === this.virtualScroll.items?.length)
                         || (this._itemCount % this.pageSize !== 0);
        this._itemCount = this.virtualScroll.items?.length;
      });
    }
    return event.target.complete();
  }
}
