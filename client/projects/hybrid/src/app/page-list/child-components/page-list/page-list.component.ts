import { Component, ContentChild, EventEmitter, Host, Input, OnInit, Optional, Output, SkipSelf, ViewChild } from '@angular/core';
import { IonContent, IonInfiniteScroll, IonRefresher, IonVirtualScroll } from '@ionic/angular';
import { PageListLoadMoreEvent, PageListRefreshEvent } from '~hybrid/page-list/interfaces/page-list-refresh-event';
import { UnwrapHostService } from '~web/shared/services/unwrap-host/unwrap-host.service';

@Component({
  selector: 'foodweb-hybrid-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.scss'],
  providers: [UnwrapHostService]
})
export class PageListComponent implements OnInit {

  @Input() disabled = false;
  @Input() endListMessage = 'End of list - Return to top';
  @Input() itemCount = 0; // Only needed if IonVirtualScroll is not ContentChild.
  @Input() loadMoreDisabled = false;
  @Input() omitInfiniteScroll = false;
  @Input() omitRefresher = false;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() refreshDisabled = false;
  @Input() threshold = '400px';

  @Output() refresh = new EventEmitter<PageListRefreshEvent>();
  @Output() loadMore = new EventEmitter<PageListLoadMoreEvent>();

  @ContentChild(IonVirtualScroll) ionVirtualScroll: IonVirtualScroll;

  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonRefresher) ionRefresher: IonRefresher;

  private _endListReached = false;
  private _listIsScrollable = false;
  private _prevItemCount = 0;

  constructor(
    @Host() @SkipSelf() @Optional()
    public ionContent: IonContent,
    private _unwrapHostService: UnwrapHostService,
  ) {}

  get endListReached(): boolean {
    return this._endListReached;
  }

  get listIsScrollable(): boolean {
    return this._listIsScrollable;
  }

  ngOnInit(): void {
    this._unwrapHostService.unwrap();
  }

  /**
   * Handles an `ionInfinite` event by loading the next segment of list items.
   * @param event The ionInfinite event.
   */
  _handleIonInfinite(event: any): void {
    ++this.page;
    event = this._handleAllIonEvents(event);
    this.loadMore.emit(event);
  }

  /**
   * Handles an `ionRefresh` event by refreshing the list items.
   * @param event The ionRefresh event.
   */
  _handleIonRefresh(event: any): void {
    this.page = 1;
    this.itemCount = 0;
    this._prevItemCount = 0;
    this._endListReached = false;
    event = this._handleAllIonEvents(event);
    this.refresh.emit(event);
  }

  private _handleAllIonEvents(event: any): any {
    const eventOverload: any = Object.assign({}, event, {
      page: this.page
    });
    eventOverload.target = Object.assign({}, event.target, {
      complete: () => {
        this._onIonEventComplete();
        return event.target.complete();
      }
    });
    return eventOverload;
  }

  private _onIonEventComplete(): void {
    setTimeout(() => { // setTimeout: Ensure all updates have occurred to ion-virtual-scroll first.
      let approxItemHeight = 50;

      // update metrics based off of transcluded IonVirtualScroll ContentChild.
      if (this.ionVirtualScroll) {
        this.ionVirtualScroll.checkEnd(); // Smoothly renders any elements added in place to the virtual scroll list.
        this.itemCount = this.ionVirtualScroll?.items?.length;
        approxItemHeight = this.ionVirtualScroll.approxItemHeight;
      }

      // Determine if the end of the list has been reached, and if IonInfiniteScroll should be disabled.
      if (this.ionInfiniteScroll) {
        this._endListReached = this._endListReached
                            || (this.itemCount % this.pageSize !== 0)
                            || (this.itemCount === this._prevItemCount);
      }
      this._prevItemCount = this.itemCount;

      // Estimate whether or not list is scrollable based on itemCount and window height.
      this._listIsScrollable = (this.itemCount * approxItemHeight) > window.innerHeight;
    });
  }
}
