import { AfterContentInit, ContentChildren, Directive, Input, QueryList, HostBinding } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute, ParamMap } from '@angular/router';

/**
 * Applies expansion panel open/close functionality based off of the current route fragment.
 * If the route fragment matches a contained expansion panel's ID, then it will automatically be opened.
 */
@Directive({
  selector: '[foodWebFragmentAccordian]'
})
export class FragmentAccordianDirective implements AfterContentInit {

  /**
   * The ID of the default expansion panel to open upon initialization if no panel is specified via route fragment.
   */
  @Input() defaultPanelId = '';

  @ContentChildren(MatExpansionPanel) expansionPanelsQuery: QueryList<MatExpansionPanel>;

  private _expandAll = false;

  constructor(
    private _activatedRoute: ActivatedRoute
  ) {}

  @HostBinding('class.expand-all')
  get expandAll(): boolean {
    return this._expandAll;
  }

  ngAfterContentInit(): void {
    // Use timeout to prevent change after checked error from Angular change detector.
    setTimeout(() => {
      this._listenQueryParamChange();
      this._listenRouteFragmentChange(); 
    });
  }

  /**
   * Listens for route query param change in order to determine if all panels should be forced expanded or not.
   */
  private _listenQueryParamChange(): void {
    this._activatedRoute.queryParamMap.subscribe((queryParams: ParamMap) => {
      this._expandAll = (queryParams.get('expandAll') === 'true');
      if (this.expandAll) {
        this.expansionPanelsQuery.forEach((expansionPanel: MatExpansionPanel) =>
          expansionPanel.open()
        );
      }
    });
  }

  /**
   * Listens for route fragment (hash-tag) change in order to determine which panel to expand.
   */
  private _listenRouteFragmentChange(): void {
    let firstFragmentChange = true;
    this._activatedRoute.fragment.subscribe((fragment: string) => {
      const openedPanel: boolean = this.openPanelWithId(fragment, !this.expandAll);
      // If there is no route fragment initially, or it doesn't match an expansion panel's ID, then expand the default.
      if (firstFragmentChange && !openedPanel) {
        this.openDefaultPanel(!this.expandAll);
      }
      firstFragmentChange = false;
    });
  }

  /**
   * Opens the expansion panel with a given ID.
   * @param id The ID of the expansion panel to open.
   * @param closeOthers Optionally set to false to prevent the closing of all other expansion panels. Defaults to true.
   */
  openPanelWithId(id: string, closeOthers = true): boolean {
    let openedPanel = false;

    // Open the panel with a matching ID, and close all others (unless specified otherwise).
    this.expansionPanelsQuery.forEach((expansionPanel: MatExpansionPanel) => {
      if (this._getPanelId(expansionPanel) === id) {
        expansionPanel.open();
        openedPanel = true;
      }
    });

    // If we found a panel to open, then close all other panels (unless configured otherwise).
    if (openedPanel && closeOthers) {
      this.expansionPanelsQuery.forEach((expansionPanel: MatExpansionPanel) => {
        if (this._getPanelId(expansionPanel) !== id) {
          expansionPanel.close();
        }
      });
    }

    return openedPanel;
  }

  /**
   * Opens the set default expansion panel.
   * @param closeOthers Optionally set to false to prevent the closing of all other expansion panels. Defaults to true.
   */
  openDefaultPanel(closeOthers = true): void {
    // Open the panel with an ID matching the default, and close all others (unless specified otherwise).
    if (this.defaultPanelId) {
      this.expansionPanelsQuery.forEach((expansionPanel: MatExpansionPanel) => {
        if (this._getPanelId(expansionPanel) === this.defaultPanelId) {
          expansionPanel.open();
        } else if (closeOthers) {
          expansionPanel.close();
        }
      });
    }
  }

  /**
   * Gets the ID of the expansion panel.
   * @param expansionPanel The expansion panel's ID.
   */
  private _getPanelId(expansionPanel: MatExpansionPanel): string {
    return expansionPanel._body.nativeElement.parentElement.id;
  }

}
