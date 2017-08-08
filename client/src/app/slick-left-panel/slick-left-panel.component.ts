import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'app-slick-left-panel',
    templateUrl: './slick-left-panel.component.html',
    styleUrls: ['./slick-left-panel.component.css']
})
export class SlickLeftPanelComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        // We want to handle scroll events to determine when we should start fixing the slickLeftPanel at top of viewport!
        window.onscroll = this.monitorScrollForStickyTop.bind(this);
    }

    /**
     * Called whenever the slickLeftPanelButton is pressed. Handles the toggling of the slickLeftPanel when in mobile mode.
     * @param slickLeftPanel The slickLeftPanel (div) element which will be toggled in or out of the viewport.
     * @param slickLeftPanelButton The slickLeftPanelButton (button) element which was pressed.
     */
    private togglePanelVisibility(slickLeftPanel: HTMLElement, slickLeftPanelButton: HTMLElement): void {
        // If our slickLeftPanel div is outside the viewport, and we are translating it into the viewport
        if (!this.isPanelToggledIntoView(slickLeftPanel)) {
            this.translateIntoView(slickLeftPanel, slickLeftPanelButton);

            // We have to handle position of slickLeftPanel when we resize the window b/c the slickLeftPanel div will potentially resize based off of the window size.
            let self = this;
            window.onresize = function () {
                self.tempDisableSmoothTranslate([slickLeftPanel, slickLeftPanelButton]);
                // Moving from mobile to desktop slickLeftPanel style.
                if (window.innerWidth > 1200) {
                    // This actually clears the translation for non-mobile view!
                    self.translateOutOfView(slickLeftPanel, slickLeftPanelButton);
                }
                // Else staying in mobile mode. Recalculate the translation based off of new width.
                else {
                    slickLeftPanel.style.transform = 'translateX(' + slickLeftPanel.offsetWidth + 'px)';
                }
            };
        }
        // Else if our slickLeftPanel div is inside the viewport, and we are translating it out of the viewport (getting rid of translation).
        else {
            this.translateOutOfView(slickLeftPanel, slickLeftPanelButton);
        }
    }

    /**
     * Determines if the slick left panel is toggled into the viewport.
     * @param slickLeftPanel The slick left panel (div) element.
     */
    private isPanelToggledIntoView(slickLeftPanel: HTMLElement): boolean {
        // If it is in view, then there will be a translation value!
        return (slickLeftPanel.style.transform != null &&
                slickLeftPanel.style.transform.length !== 0 &&
                slickLeftPanel.style.transform !== 'none');
    }

    /**
     * Toggles the slickLeftPanel into the viewport.
     * @param slickLeftPanel The slickLeftPanel (div) element which will be toggled into the viewport.
     * @param slickLeftPanelButton The slickLeftPanelButton (button) element which was pressed.
     */
    private translateIntoView(slickLeftPanel: HTMLElement, slickLeftPanelButton: HTMLElement): void {
        // The translation amount will be the width of the slickLeftPanel div.
        slickLeftPanel.style.transform = 'translateX(' + slickLeftPanel.offsetWidth + 'px)';
        slickLeftPanelButton.textContent = '<';
        slickLeftPanelButton.style.right = '0px';
    }

    /**
     * Toggles the slickLeftPanel out of the viewport.
     * @param slickLeftPanel The slickLeftPanel (div) element which will be toggled out of the viewport.
     * @param slickLeftPanelButton The slickLeftPanelButton (button) element which was pressed.
     */
    private translateOutOfView(slickLeftPanel: HTMLElement, slickLeftPanelButton: HTMLElement): void {
        slickLeftPanel.style.transform = null;
        slickLeftPanelButton.textContent = '>';
        slickLeftPanelButton.style.right = '-' + slickLeftPanelButton.offsetWidth + 'px';
        window.onresize = undefined;
    }

    /**
     * Temporarily disables any smooth translation effects defined in css for the given elements so that they will move instantly.
     * @param elements The elements to disable smooth translate for.
     */
    private tempDisableSmoothTranslate(elements: Array<HTMLElement>): void {
        for (let i: number = 0; i < elements.length; i++) {
            let element: HTMLElement = elements[i];
            element.style.transition = undefined; // Stop the smooth translation with delay for an instant.
            // This shall run after we are finished with all of our processing!
            setTimeout(() => { element.style.transition = 'all 1s ease'; }, 0);
        }
    }

    /**
     * Handles a scroll event to determine when to fix the slickLeftPanel div to the top of the viewport. We will fix it when
     * we scroll to or past the top of the slickLeftPanel div. We will unfix it when we scroll above this position once more.
     * @param event The scroll event.
     */
    private monitorScrollForStickyTop(event: Event): void {
        let slickLeftPanel: HTMLElement = document.getElementById('slick-left-panel'); // This can potentially get out of sync with template if id changes!
        let fixCutoff = this.getAbsolutePosTop(slickLeftPanel.parentElement);

        if (document.body.scrollTop >= fixCutoff) {
            slickLeftPanel.style.position = 'fixed';
            slickLeftPanel.style.top = '0px';
        }
        else {
            slickLeftPanel.style.position = 'absolute';
            slickLeftPanel.style.top = 'auto';
        }
    }

    /**
     * Calculates the absolute position of the top of a given HTML element.
     * @param element The element to get the absolute position of.
     */
    private getAbsolutePosTop(element): number {
        let top: number = 0;

        do {
            top += element.offsetTop || 0;
            element = element.offsetParent;
        } while (element);

        return top;
    }
}
