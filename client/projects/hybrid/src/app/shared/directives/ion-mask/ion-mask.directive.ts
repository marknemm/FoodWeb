import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { createTextMaskInputElement } from 'text-mask-core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ionMask]',
  providers: [IonInput]
})
export class IonMaskDirective implements OnInit, OnDestroy {

  @Input('ionMask') mask: IonMask = [];

  @Input() guide = false;
  @Input() keepCharPositions = false;
  @Input() placeholderChar: string;

  private _destroy$: Subject<void> = new Subject<void>();

  constructor(
    public ionInput: IonInput
  ) {}

  ngOnInit(): void {
    this._configureInput();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
  }

  private async _configureInput(): Promise<void> {
    const input: HTMLInputElement = await this.ionInput.getInputElement();
    const maskedInput = createTextMaskInputElement({
      guide: this.guide,
      keepCharPositions: this.keepCharPositions,
      inputElement: input,
      mask: this.mask,
      placeholderChar: this.placeholderChar,
    });

    this.ionInput.ionChange.pipe(
      takeUntil(this._destroy$)
    ).subscribe((event: CustomEvent) => {
      const value: string = event.detail.value;
      maskedInput.update(value);
      this.ionInput.value = input.value;
    });
  }

}

export type IonMask = (RegExp | string)[]
                    | ((rawValue: string) => (RegExp | String)[]);

export const PHONE_NUMBER_MASK = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
