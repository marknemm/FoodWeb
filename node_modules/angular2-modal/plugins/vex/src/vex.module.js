import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule, Modal as BaseModal } from 'angular2-modal';
import { Modal } from './modal';
import { DialogFormModal, FormDropIn, VEXDialogButtons } from './dialog-form-modal';
export var /** @type {?} */ providers = [
    { provide: BaseModal, useClass: Modal },
    { provide: Modal, useClass: Modal }
];
var VexModalModule = (function () {
    function VexModalModule() {
    }
    /**
     * @return {?}
     */
    VexModalModule.getProviders = function () {
        return providers;
    };
    VexModalModule.decorators = [
        { type: NgModule, args: [{
                    imports: [ModalModule, CommonModule],
                    declarations: [
                        VEXDialogButtons,
                        FormDropIn,
                        DialogFormModal
                    ],
                    providers: providers,
                    entryComponents: [
                        DialogFormModal,
                        FormDropIn
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    VexModalModule.ctorParameters = function () { return []; };
    return VexModalModule;
}());
export { VexModalModule };
function VexModalModule_tsickle_Closure_declarations() {
    /** @type {?} */
    VexModalModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    VexModalModule.ctorParameters;
}
//# sourceMappingURL=vex.module.js.map