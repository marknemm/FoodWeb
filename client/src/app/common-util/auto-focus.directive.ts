import { Directive, OnInit, ElementRef } from '@angular/core';


@Directive({
    selector: '[appAutoFocus]'
})
export class AutoFocusDirective implements OnInit {

    public constructor(
        private elementRef: ElementRef
    ) { };

    public ngOnInit(): void {
        this.elementRef.nativeElement.focus();
    }
}
