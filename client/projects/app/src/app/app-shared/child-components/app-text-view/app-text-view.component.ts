import { Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AutocapitalizationType, Label, ReturnKeyType, TextTransform, TextView, Visibility } from '@nativescript/core';
import { KeyboardType } from '@nativescript/core/ui/enums';
import { TextAlignment, TextDecoration, WhiteSpace } from '@nativescript/core/ui/text-base';
import { Focusable } from '~app/app-shared/interfaces/focusable';
import { FormBaseComponent, valueAccessorProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({
  selector: 'foodweb-app-text-view',
  templateUrl: './app-text-view.component.html',
  styleUrls: ['./app-text-view.component.scss'],
  providers: valueAccessorProvider(AppTextViewComponent)
})
export class AppTextViewComponent extends FormBaseComponent<string> implements OnInit, OnChanges, Focusable {

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
  @Input() visible: Visibility | boolean = 'visible';
  @Input() whiteSpace: WhiteSpace = 'normal';

  @Output() blur = new EventEmitter();
  @Output() done = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('focus') focusOut = new EventEmitter();
  @Output() returnPress = new EventEmitter();
  @Output() textChange = new EventEmitter();
  @Output() textFieldTap = new EventEmitter();

  @ViewChild('labelRef', { static: true }) labelRef: ElementRef<Label>;
  @ViewChild('textViewRef', { static: true }) textViewRef: ElementRef<TextView>;

  @HostBinding() readonly class = 'foodweb-app-text-view';

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isReturnKeyTypeDone && this.isReturnKeyTypeDone != null) {
      this.returnKeyType = (this.isReturnKeyTypeDone ? 'done' : 'next');
    }
  }

  ngOnInit() {
    super.ngOnInit();
  }

  focus(): boolean {
    return this.textViewRef.nativeElement.focus();
  }

  dismissSoftInput(): void {
    this.textViewRef.nativeElement.dismissSoftInput();
  }

  onReturnPress(event: any): void {
    this.returnPress.emit(event);
    if (this.returnKeyType === 'next') {
      this.nextFocus?.focus();
    } else if (this.returnKeyType === 'done') {
      this.done.emit();
    }
  }
}
