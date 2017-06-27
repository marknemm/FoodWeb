import { ComponentFactoryResolver, ReflectiveInjector } from '@angular/core';
/**
 * @param {?} instructions
 * @return {?}
 */
export function createComponent(instructions) {
    var /** @type {?} */ injector = getInjector(instructions);
    var /** @type {?} */ cmpFactory = injector.get(ComponentFactoryResolver).resolveComponentFactory(instructions.component);
    if (instructions.vcRef) {
        return instructions.vcRef.createComponent(cmpFactory, instructions.vcRef.length, injector, instructions.projectableNodes);
    }
    else {
        return cmpFactory.create(injector);
    }
}
/**
 * @param {?} instructions
 * @return {?}
 */
function getInjector(instructions) {
    var /** @type {?} */ ctxInjector = instructions.injector || instructions.vcRef.parentInjector;
    return Array.isArray(instructions.bindings) && instructions.bindings.length > 0 ?
        ReflectiveInjector.fromResolvedProviders(instructions.bindings, ctxInjector) : ctxInjector;
}
//# sourceMappingURL=createComponent.js.map