import { Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AutocapitalizationType, Label, ReturnKeyType, TextTransform, TextView } from '@nativescript/core';
import { KeyboardType } from '@nativescript/core/ui/enums';
import { TextAlignment, TextDecoration, WhiteSpace } from '@nativescript/core/ui/text-base';
import { AppFocusService, Focusable, FocusableComponent } from '~app/app-shared/services/app-focus/app-focus.service';
import { FormBaseComponent, FormHelperService, formProvider, TFormControl } from '~web/forms';

@Component({
  selector: 'foodweb-app-text-view',
  templateUrl: './app-text-view.component.html',
  styleUrls: ['./app-text-view.component.scss'],
  providers: formProvider(AppTextViewComponent)
})
export class AppTextViewComponent extends FormBaseComponent<string> implements OnChanges, FocusableComponent {

  @Input() autocapitalizationType: AutocapitalizationType = 'none';
  @Input() autocorrect: BooleanInput = true;
  @Input() editable: BooleanInput = true;
  @Input() hint = '';
  @Input() isReturnKeyTypeDone = false;
  @Input() keyboardType: KeyboardType;
  @Input() letterSpacing = 0;
  @Input() label = '';
  @Input() lineHeight: number;
  @Input() maxLength = 999999999;
  @Input() nextFocus: Focusable;
  @Input() returnKeyType: ReturnKeyType;
  @Input() secure: BooleanInput = false;
  @Input() text = '';
  @Input() textAlignment: TextAlignment = 'left';
  @Input() textDecoration: TextDecoration = 'none';
  @Input() textTransform: TextTransform = 'none';
  @Input() visible: VisibleInput = 'visible';
  @Input() whiteSpace: WhiteSpace = 'normal';

  @Output() blur = new EventEmitter();
  @Output() done = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('focus') focusOutput = new EventEmitter();
  @Output() returnPress = new EventEmitter();
  @Output() textChange = new EventEmitter();
  @Output() textFieldTap = new EventEmitter();

  @ViewChild('labelRef', { static: true }) labelRef: ElementRef<Label>;
  @ViewChild('textViewRef', { static: true }) textViewRef: ElementRef<TextView>;

  @HostBinding() readonly class = 'foodweb-app-text-view';

  constructor(
    private _focusService: AppFocusService,
    formHelperService: FormHelperService,
  ) {
    super(new TFormControl<string>(), formHelperService);
  }

  get focusElement(): Focusable {
    return this.textViewRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (changes.isReturnKeyTypeDone && this.isReturnKeyTypeDone != null) {
      this.returnKeyType = (this.isReturnKeyTypeDone ? 'done' : 'next');
    }
  }

  dismissSoftInput(): void {
    this.textViewRef.nativeElement.dismissSoftInput();
  }

  focus(): boolean {
    return this._focusService.focus(this, this.textViewRef.nativeElement);
  }

  onReturnPress(event: any): void {
    this.returnPress.emit(event);
    if (this.returnKeyType === 'next') {
      this._focusService.focusNext(this, true);
    } else if (this.returnKeyType === 'done') {
      this.done.emit();
    }
  }
}
