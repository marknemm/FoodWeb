import { ANALYZE_FOR_ENTRY_COMPONENTS, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { DOMOutsideEventPlugin, DOMOverlayRenderer } from './providers/index';
import { OverlayRenderer } from './models/tokens';
import { CSSBackdrop, CSSDialogContainer } from './components/index';
import { Overlay, ModalOverlay, OverlayDialogBoundary, OverlayTarget } from './overlay/index';
var ModalModule = (function () {
    function ModalModule() {
    }
    /**
     * Returns a ModalModule pre-loaded with a list of dynamically inserted components.
     * Since dynamic components are not analysed by the angular compiler they must register manually
     * using entryComponents, this is an easy way to do it.
     * @param {?} entryComponents A list of dynamically inserted components (dialog's).
     * @return {?}
     */
    ModalModule.withComponents = function (entryComponents) {
        return {
            ngModule: ModalModule,
            providers: [
                { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: entryComponents, multi: true }
            ]
        };
    };
    /**
     * Returns a NgModule for use in the root Module.
     * @param {?=} entryComponents A list of dynamically inserted components (dialog's).
     * @return {?} ModuleWithProviders
     */
    ModalModule.forRoot = function (entryComponents) {
        return {
            ngModule: ModalModule,
            providers: [
                { provide: OverlayRenderer, useClass: DOMOverlayRenderer },
                { provide: EVENT_MANAGER_PLUGINS, useClass: DOMOutsideEventPlugin, multi: true },
                { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: entryComponents || [], multi: true }
            ]
        };
    };
    ModalModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        ModalOverlay,
                        CSSBackdrop,
                        CSSDialogContainer,
                        OverlayDialogBoundary,
                        OverlayTarget
                    ],
                    imports: [CommonModule],
                    exports: [
                        CSSBackdrop,
                        CSSDialogContainer,
                        OverlayDialogBoundary,
                        OverlayTarget
                    ],
                    providers: [
                        Overlay
                    ],
                    entryComponents: [
                        ModalOverlay,
                        CSSBackdrop,
                        CSSDialogContainer
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    ModalModule.ctorParameters = function () { return []; };
    return ModalModule;
}());
export { ModalModule };
function ModalModule_tsickle_Closure_declarations() {
    /** @type {?} */
    ModalModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ModalModule.ctorParameters;
}
//# sourceMappingURL=angular2-modal.module.js.map