import { Injectable } from '@angular/core';
import { Focusable } from '~app/app-shared/interfaces/focusable';

/**
 * A tabs service that provides common functionality for dealing with tabs on a mobile app page.
 * Should be provided by the component where it is used.
 */
@Injectable()
export class AppTabsService {

  private _tabIdx = 0;
  private _tabIdxHistory: number[] = [];

  /**
   * The length of visited tab history that has been recorded.
   */
  get tabIdxHistoryLength(): number {
    return this._tabIdxHistory.length;
  }

  /**
   * The current active tab's index.
   */
  get tabIdx(): number {
    return this._tabIdx;
  }

  constructor() {}

  /**
   * Activates the tab immediately to the right of the current active tab.
   */
  nextTab(): void {
    this.toTab(this._tabIdx + 1);
  }

  /**
   * Activates the tab immediately to the right of the current active tab, and focuses a given element within it.
   * @param focusable The element to focus within the tab that is to be activated.
   */
  nextTabAndFocus(focusable: Focusable): void {
    this.nextTab();
    focusable.focus();
  }

  /**
   * Activates the tab immediately to the left of the current active tab.
   */
  prevTab(): void {
    this.toTab(this._tabIdx - 1);
  }

  /**
   * Activates the tab immediately to the left of the current active tab, and focuses a given element within it.
   * @param focusable The elemnt to focus within the tab that is to be activated.
   */
  prevTabAndFocus(focusable: Focusable): void {
    this.prevTab();
    focusable.focus();
  }

  /**
   * Activates the last recorded tab that was previously visited in tab history.
   */
  tabHistoryBack(): void {
    if (this.tabIdxHistoryLength) {
      this._tabIdx = this._tabIdxHistory.pop();
    }
  }

  /**
   * Activates a tab at a given tab index.
   * @param tabIdx The tab index that shall be activated.
   */
  toTab(tabIdx: number): void {
    if (this.tabIdx !== tabIdx && tabIdx >= 0) {
      this._tabIdxHistory.push(this._tabIdx);
      this._tabIdx = tabIdx;
    }
  }
}
