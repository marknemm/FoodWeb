import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule, Modal as BaseModal } from 'angular2-modal';
import { Modal } from './modal';
import { BSModalContainer } from './modal-container.component';
import { BSMessageModal, BSMessageModalTitle, BSMessageModalBody, BSModalFooter } from './message-modal.component';
export var /** @type {?} */ providers = [
    { provide: BaseModal, useClass: Modal },
    { provide: Modal, useClass: Modal }
];
var BootstrapModalModule = (function () {
    function BootstrapModalModule() {
    }
    /**
     * @return {?}
     */
    BootstrapModalModule.getProviders = function () {
        return providers;
    };
    BootstrapModalModule.decorators = [
        { type: NgModule, args: [{
                    imports: [ModalModule, CommonModule],
                    declarations: [
                        BSModalFooter,
                        BSMessageModalTitle,
                        BSMessageModalBody,
                        BSMessageModal,
                        BSModalContainer
                    ],
                    providers: providers,
                    entryComponents: [
                        BSModalContainer,
                        BSMessageModal
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    BootstrapModalModule.ctorParameters = function () { return []; };
    return BootstrapModalModule;
}());
export { BootstrapModalModule };
function BootstrapModalModule_tsickle_Closure_declarations() {
    /** @type {?} */
    BootstrapModalModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    BootstrapModalModule.ctorParameters;
}
//# sourceMappingURL=bootstrap.module.js.map