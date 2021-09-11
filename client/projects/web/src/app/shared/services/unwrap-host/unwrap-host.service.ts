import { ElementRef, Injectable, Renderer2 } from '@angular/core';

/**
 * A service that should be provided by a component for which it shall unwrap the (host) element.
 */
@Injectable()
export class UnwrapHostService {

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _renderer: Renderer2
  ) {}

  /**
   * Unwraps the calling component's element.
   *
   * `Note`: Should be invoked within the component's `ngOnInit` lifecycle hook.
   */
  unwrap(): void {
    // Access the DOM. get the element to unwrap
    const element: HTMLElement = this._elementRef.nativeElement;
    const parent: HTMLElement = this._renderer.parentNode(element);

    // move all children out of the element
    while (element.firstChild) { // this line doesn't work with server-rendering
      this._renderer.insertBefore(parent, element.firstChild, element);
    }

    // remove the empty element from parent
    this._renderer.removeChild(parent, element);
  }
}
