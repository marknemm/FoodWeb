import { Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AutocapitalizationType, Label, ReturnKeyType, TextTransform, TextView } from '@nativescript/core';
import { KeyboardType } from '@nativescript/core/ui/enums';
import { TextAlignment, TextDecoration, WhiteSpace } from '@nativescript/core/ui/text-base';
import { FormBaseComponent, valueAccessorProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({
  selector: 'foodweb-app-text-view',
  templateUrl: './app-text-view.component.html',
  styleUrls: ['./app-text-view.component.scss'],
  providers: valueAccessorProvider(AppTextViewComponent)
})
export class AppTextViewComponent extends FormBaseComponent<string> implements OnInit {

  @Input() autocapitalizationType: AutocapitalizationType = 'none';
  @Input() autocorrect: BooleanInput = true;
  @Input() editable: BooleanInput = true;
  @Input() hint = '';
  @Input() keyboardType: KeyboardType;
  @Input() letterSpacing = 0;
  @Input() label = '';
  @Input() lineHeight: number;
  @Input() maxLength = 999999999;
  @Input() returnKeyType: ReturnKeyType;
  @Input() secure: BooleanInput = false;
  @Input() text = '';
  @Input() textAlignment: TextAlignment = 'left';
  @Input() textDecoration: TextDecoration = 'none';
  @Input() textTransform: TextTransform = 'none';
  @Input() whiteSpace: WhiteSpace = 'normal';

  @Output() blur = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('focus') focusOut = new EventEmitter();
  @Output() returnPress = new EventEmitter();
  @Output() textChange = new EventEmitter();
  @Output() textFieldTap = new EventEmitter();

  @ViewChild('labelRef') labelRef: ElementRef<Label>;
  @ViewChild('textViewRef') textViewRef: ElementRef<TextView>;

  @HostBinding() readonly class = 'foodweb-app-text-view';

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
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
}
