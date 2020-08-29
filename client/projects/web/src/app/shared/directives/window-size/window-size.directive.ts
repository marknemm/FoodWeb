import { Directive } from '@angular/core';

@Directive({
  selector: '[foodwebWindowSize]'
})
export class WindowSizeDirective {

  constructor(
    private _window: Window,
  ) {}



}
