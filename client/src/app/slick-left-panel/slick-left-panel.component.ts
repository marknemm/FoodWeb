import { Component, Input } from '@angular/core';


@Component({
    selector: 'app-slick-left-panel',
    templateUrl: './slick-left-panel.component.html',
    styleUrls: ['./slick-left-panel.component.css']
})
export class SlickLeftPanelComponent {

    /**
     * The title of the toggle button. Will show in the tooltip tab for the button on hover.
     */
    @Input() private buttonTitle: string = "toggle";
    /**
     * Set to true if clicks outside of the panel should be ignored (and the panel state will remain unchanged/open/visible).
     */
    @Input() private ignoreClicksOutsidePanel: boolean = false;
    /**
     * Set to the ID of an elemnent that when clicked, it will not count as a click outside of the panel.
     * This means that clicking this element (or any contained children) will not result in a state chnage (closing) of the panel.
     */
    @Input() private ignoreOutsideClickInId: string;


    constructor() { }


    /**
     * Called whenever the slickLeftPanelButton is pressed. Handles the toggling of the slickLeftPanel when in mobile mode.
     * @param slickLeftPanel The slickLeftPanel (div) element which will be toggled in or out of the viewport.
     * @param slickLeftPanelButton The slickLeftPanelButton (button) element which was pressed.
     */
    private togglePanelVisibility(slickLeftPanel: HTMLElement, slickLeftPanelButton: HTMLElement): void {
        // If our slickLeftPanel div is outside the viewport, and we are translating it into the viewport
        if (!this.isPanelToggledIntoView(slickLeftPanel)) {
            this.toggleIntoView(slickLeftPanel, slickLeftPanelButton);
        }
        // Else if our slickLeftPanel div is inside the viewport, and we are translating it out of the viewport (getting rid of translation).
        else {
            this.toggleOutOfView(slickLeftPanel, slickLeftPanelButton);
        }
    }


    /**
     * Determines if the slick left panel is toggled into the viewport.
     * @param slickLeftPanel The slick left panel (div) element.
     */
    private isPanelToggledIntoView(slickLeftPanel: HTMLElement): boolean {
        // If it is in view, then there will be a translation value!
        return slickLeftPanel.classList.contains('toggle-into-view');
    }


    /**
     * Toggles the slickLeftPanel into the viewport.
     * @param slickLeftPanel The slickLeftPanel (div) element which will be toggled into the viewport.
     * @param slickLeftPanelButton The slickLeftPanelButton (button) element which was pressed.
     */
    private toggleIntoView(slickLeftPanel: HTMLElement, slickLeftPanelButton: HTMLElement): void {
        // The toggle-into-view css class contains the translation.
        slickLeftPanel.classList.add('toggle-into-view');
        slickLeftPanelButton.style.right = '0px';
        window.onclick = this.handleClickOutsidePanel.bind(this, slickLeftPanel, slickLeftPanelButton);
    }


    /**
     * Handles detected clicks outside of this panel by closing the panel.
     * @param slickLeftPanel The click left panel.
     * @param slickLeftPanelButton The toggle button for the slick left panel.
     * @param event The click event that was detected outside of the panel.
     */
    private handleClickOutsidePanel(slickLeftPanel: HTMLElement, slickLeftPanelButton: HTMLElement, event): void {
        const clickOutsidePanel: boolean = !slickLeftPanel.contains(event.target);
        // Parent may have specified the ID of an element which we are to ignore clicks inside of.
        const clickOutsideIgnoredElement: boolean = (   this.ignoreOutsideClickInId == null
                                                     || document.getElementById(this.ignoreOutsideClickInId) == null 
                                                     || !document.getElementById(this.ignoreOutsideClickInId).contains(event.target));

        // If click is outside panel, it should not be ignored, and it's outside of any marked element that should be ignored.
        if (!this.ignoreClicksOutsidePanel && clickOutsidePanel && clickOutsideIgnoredElement) {
            this.toggleOutOfView(slickLeftPanel, slickLeftPanelButton);
        }
    }


    /**
     * Toggles the slickLeftPanel out of the viewport.
     * @param slickLeftPanel The slickLeftPanel (div) element which will be toggled out of the viewport.
     * @param slickLeftPanelButton The slickLeftPanelButton (button) element which was pressed.
     */
    private toggleOutOfView(slickLeftPanel: HTMLElement, slickLeftPanelButton: HTMLElement): void {
        window.onclick = null;
        slickLeftPanel.classList.remove('toggle-into-view');
        slickLeftPanelButton.style.right = '-' + slickLeftPanelButton.offsetWidth + 'px';
    }


    /**
     * Handles a scroll event to determine when to fix the slickLeftPanel div to the top of the viewport. We will fix it when
     * we scroll to or past the top of the slickLeftPanel div. We will unfix it when we scroll above this position once more.
     * @param event The scroll event.
     */
    /*private monitorScrollForStickyTop(event: Event): void {
        let slickLeftPanel: HTMLElement = document.getElementById('slick-left-panel'); // This can potentially get out of sync with template if id changes!
        let fixCutoff: number = this.getAbsolutePosTop(slickLeftPanel.parentElement);
        let scrollPosition: number = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);

        if (scrollPosition >= fixCutoff) {
            slickLeftPanel.style.position = 'fixed';
            slickLeftPanel.style.top = '0px';
        }
        else {
            slickLeftPanel.style.position = 'absolute';
            slickLeftPanel.style.top = 'auto';
        }
    }*/


    /**
     * Calculates the absolute position of the top of a given HTML element.
     * @param element The element to get the absolute position of.
     */
    /*private getAbsolutePosTop(element): number {
        let top: number = 0;

        do {
            top += element.offsetTop || 0;
            element = element.offsetParent;
        } while (element);

        return top;
    }*/
}
