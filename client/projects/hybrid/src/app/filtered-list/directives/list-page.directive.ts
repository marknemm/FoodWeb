import { AfterContentInit, ComponentFactory, ComponentFactoryResolver, ComponentRef, ContentChild, Directive, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import { IonInfiniteScroll, IonInfiniteScrollContent, IonRefresher, IonRefresherContent, IonVirtualScroll } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Enhances a page `ion-content` that is primarily composed of a large list.
 * Contains functionality for automatically adding `ion-refresher` & `ion-infinite-scroll` elements to the beginning and end of the host.
 *
 * Also, exposes `refresh` & `loadMore` output bindings that enhance the corresponding `ionRefresh` & `ionInfinite` events with
 * pagination data.
 *
 * Additionally, invokes `checkEnd()` on `ion-virtual-scroll` content whenever `refresh` & `loadMore` events fire in order to implement smooth
 * addition/reset of contained items.
 *
 * Finally, automatically calculates when to disable the `ion-infinite-scroll` based off of a given `pageSize` input binding (default 10),
 * and the detected number of items loaded on each `loadMore` event.
 */
@Directive({
  selector: 'ion-content[foodwebHybridListPage]'
})
export class ListPageDirective implements OnChanges, AfterContentInit, OnDestroy {

  @Input() disabled = false;
  @Input() loadMoreDisabled = false;
  @Input() omitInfiniteScroll = false;
  @Input() omitRefresher = false;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() refreshDisabled = false;

  @ContentChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  @ContentChild(IonRefresher) ionRefresher: IonRefresher;
  @ContentChild(IonVirtualScroll) ionVirtualScroll: IonVirtualScroll;

  @Output() loadMore = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<any>();

  private _destroy$ = new Subject();
  private _host: HTMLElement;
  private _itemCount = 0;

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _componentFactoryResolver: ComponentFactoryResolver,
    elementRef: ElementRef,
  ) {
    this._host = elementRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => { // setTimeout: Ensure ionInfiniteScroll & ionRefresher are initialized after content init.
      if (changes.page && this.page <= 1 && this.ionInfiniteScroll) {
        this._itemCount = 0;
        this.ionInfiniteScroll.disabled = (this.loadMoreDisabled || this.disabled);
      }

      if ((changes.loadMoreDisabled || changes.disabled) && this.ionInfiniteScroll) {
        this.ionInfiniteScroll.disabled = this.loadMoreDisabled || this.disabled || (this._itemCount % this.pageSize !== 0);
      }

      if ((changes.refreshDisabled || changes.disabled) && this.ionRefresher) {
        this.ionRefresher.disabled = (this.refreshDisabled || this.disabled);
      }
    });
  }

  ngAfterContentInit(): void {
    // Create any missing infinite scroll or refresher content children.
    if (!this.ionInfiniteScroll && !this.omitInfiniteScroll) {
      this._createIonInfiniteScroll();
    }
    if (!this.ionRefresher && !this.omitRefresher) {
      this._createIonRefresher();
    }

    // Overload infinite scroll (load more) and refresh events to refresh virtual list properly and include page data.
    if (this.ionInfiniteScroll) {
      this._overloadIonInfiniteEvent();
    }
    if (this.ionRefresher) {
      this._overloadIonRefreshEvent();
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next(); // Prevent RxJS memory leaks.
  }

  private  _createIonInfiniteScroll(): void {
    const ionInfiniteScrollFactory: ComponentFactory<IonInfiniteScroll> = this._componentFactoryResolver.resolveComponentFactory(IonInfiniteScroll);
    const ionInfiniteScrollRef: ComponentRef<IonInfiniteScroll> = this._viewContainerRef.createComponent(ionInfiniteScrollFactory);

    const ionInfiniteScrollContentFactory: ComponentFactory<IonInfiniteScrollContent> = this._componentFactoryResolver.resolveComponentFactory(IonInfiniteScrollContent);
    const ionInfiniteScrollContentRef: ComponentRef<IonInfiniteScrollContent> = this._viewContainerRef.createComponent(ionInfiniteScrollContentFactory);
    ionInfiniteScrollRef.location.nativeElement.appendChild(ionInfiniteScrollContentRef.location.nativeElement);

    this._host.appendChild(ionInfiniteScrollRef.location.nativeElement);
    this.ionInfiniteScroll = ionInfiniteScrollRef.instance;
  }

  private _createIonRefresher(): void {
    const ionRefresherFactory: ComponentFactory<IonRefresher> = this._componentFactoryResolver.resolveComponentFactory(IonRefresher);
    const ionRefresherRef: ComponentRef<IonRefresher> = this._viewContainerRef.createComponent(ionRefresherFactory);
    ionRefresherRef.location.nativeElement.slot = 'fixed';

    const ionRefresherContentFactory: ComponentFactory<IonRefresherContent> = this._componentFactoryResolver.resolveComponentFactory(IonRefresherContent);
    const ionRefresherContentRef: ComponentRef<IonRefresherContent> = this._viewContainerRef.createComponent(ionRefresherContentFactory);
    ionRefresherRef.location.nativeElement.appendChild(ionRefresherContentRef.location.nativeElement);

    this._host.insertBefore(ionRefresherRef.location.nativeElement, this._host.firstChild);
    this.ionRefresher = ionRefresherRef.instance;
  }

  private _overloadIonInfiniteEvent(): void {
    this.ionInfiniteScroll.ionInfinite.pipe(
      takeUntil(this._destroy$)
    ).subscribe((event: any) => {
      ++this.page;
      event = this._overloadAllIonEvents(event);
      this.loadMore.emit(event);
    });
  }

  private _overloadIonRefreshEvent(): void {
    this.ionRefresher.ionRefresh.pipe(
      takeUntil(this._destroy$)
    ).subscribe((event: any) => {
      this.page = 1;
      this._itemCount = 0;
      this.ionInfiniteScroll.disabled = (this.loadMoreDisabled || this.disabled);
      event = this._overloadAllIonEvents(event);
      this.refresh.emit(event);
    });
  }

  private _overloadAllIonEvents(event: any): any {
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
    if (this.ionVirtualScroll) {
      this.ionVirtualScroll.checkEnd();
      setTimeout(() => { // setTimeout: Ensure all updates have occured to ion-virtual-scroll first.
        this.ionInfiniteScroll.disabled = (this.loadMoreDisabled || this.disabled)
          || (this._itemCount === this.ionVirtualScroll.items?.length)
          || (this._itemCount % this.pageSize !== 0);
        this._itemCount = this.ionVirtualScroll.items?.length;
      });
    }
  }

}
