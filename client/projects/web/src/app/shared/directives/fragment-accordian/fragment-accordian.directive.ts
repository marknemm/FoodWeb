import { AfterContentInit, ContentChildren, Directive, Input, QueryList } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';

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

  constructor(
    private _activatedRoute: ActivatedRoute
  ) {}

  ngAfterContentInit(): void {
    let firstFragmentChange = true;
    // Use timeout to prevent change after checked error from Angular change detector.
    setTimeout(() => 
      this._activatedRoute.fragment.subscribe((fragment: string) => {
        const openedPanel: boolean = this.openPanelWithId(fragment);
        // If there is no route fragment initially, or it doesn't match an expansion panel's ID, then open the default.
        if (firstFragmentChange && !openedPanel) {
          this.openDefaultPanel();
        }
        firstFragmentChange = false;
      })
    );
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
      } else if (closeOthers) {
        expansionPanel.close();
      }
    });

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
