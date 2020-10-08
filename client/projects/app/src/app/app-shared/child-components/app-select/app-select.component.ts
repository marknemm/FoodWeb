import { Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from '@nativescript/angular';
import { TextAlignment, TextDecoration, TextTransform, WhiteSpace } from '@nativescript/core/ui/text-base';
import { AppFocusMaskComponent } from '~app/app-shared/child-components/app-focus-mask/app-focus-mask.component';
import { AppSelectDialogComponent, AppSelectDialogContext } from '~app/app-shared/child-components/app-select-dialog/app-select-dialog.component';
import { AppTextFieldComponent } from '~app/app-shared/child-components/app-text-field/app-text-field.component';
import { RawSelectItem, SelectItem } from '~app/app-shared/interfaces/select-item';
import { AppFocusService, Focusable, FocusableComponent } from '~app/app-shared/services/app-focus/app-focus.service';
import _ from '~lodash-mixins';
import { FormBaseComponent, formProvider } from '~web/data-structure/form-base-component';
import { TFormControl } from '~web/data-structure/t-form-control';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';
export * from '~app/app-shared/interfaces/select-item';

@Component({
  selector: 'foodweb-app-select',
  templateUrl: './app-select.component.html',
  styleUrls: ['./app-select.component.scss'],
  providers: formProvider(AppSelectComponent)
})
export class AppSelectComponent<T = any> extends FormBaseComponent<TFormControl<T>> implements OnInit, OnChanges, FocusableComponent {

  @Input() dialogTitle = ''; // Will default to label when supplied to select dialog.
  @Input() enabled: BooleanInput = true;
  @Input() hint = '';
  @Input() hintIsDialogTitle: BooleanInput = false;
  @Input() isReturnKeyTypeDone = false;
  @Input() items: RawSelectItem<T>[] = [];
  @Input() letterSpacing = 0;
  @Input() label = '';
  @Input() lineHeight: number;
  @Input() nextFocus: Focusable;
  @Input() requireErrMsg = 'Required';
  @Input() selectedIndex: number;
  @Input() textAlignment: TextAlignment = 'left';
  @Input() textDecoration: TextDecoration = 'none';
  @Input() textTransform: TextTransform = 'none';
  @Input() visible: VisibleInput = 'visible';
  @Input() whiteSpace: WhiteSpace = 'normal';

  @Input() set editable(value: BooleanInput) {
    this.enabled = value;
  }
  get editable(): BooleanInput {
    return this.enabled;
  }

  @Output() blur = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('focus') focusOutput = new EventEmitter();
  @Output() select = new EventEmitter<SelectItem<T>>();
  @Output() selectDialogClose = new EventEmitter();
  @Output() selectDialogOpen = new EventEmitter();
  @Output() selectedIndexChange = new EventEmitter<number>();

  @ViewChild('textField', { static: true }) textField: AppTextFieldComponent;
  @ViewChild('focusMask', { static: true }) focusMask: AppFocusMaskComponent;

  @HostBinding() readonly class = 'foodweb-app-select';

  private _dialogOpened = false;
  private _itemNames: string[] = [];

  constructor(
    private _focusService: AppFocusService,
    private _modalDialogService: ModalDialogService,
    private _viewContainerRef: ViewContainerRef,
    formHelperService: FormHelperService
  ) {
    super(new TFormControl<T>(), formHelperService);
  }

  get dialogOpened(): boolean {
    return this._dialogOpened;
  }

  get focusElement(): Focusable {
    return this.focusMask;
  }

  get selectedItemName(): string {
    return this._itemNames[this.selectedIndex];
  }

  ngOnInit() {
    if (this.selectedIndex == null) {
      // setTimeout: Fix NativeScript timing bug for initialization of TextField value...
      setTimeout(() => this.selectedIndex = this._deriveSelectedIdx());
    }
    this.onValueChanges().subscribe(() =>
      this.selectedIndex = this._deriveSelectedIdx()
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes.items) {
      this._itemNames = this._getItemNames();
    }
  }

  focus(): boolean {
    return this._focusService.focus(this, this.focusMask);
  }

  onFocusTap(): void {
    this.focusOutput.emit();
    this.showSelectDialog();
  }

  showSelectDialog(): void {
    if (this.dialogOpened) { return; }

    const context: AppSelectDialogContext = this._genSelectDialogContext();
    this._dialogOpened = true;
    this.selectDialogOpen.emit();

    this._modalDialogService
      .showModal(AppSelectDialogComponent, {
        context,
        viewContainerRef: this._viewContainerRef
      })
      .then((selectedIdx: number) => {
        if (selectedIdx != null) {
          const selectedValue: T = this._getItemValue(selectedIdx);
          this.formControl.setValue(selectedValue); // Triggers selectedIndex/selectedItemName update.
          this.select.emit({ name: this.selectedItemName, value: selectedValue });
        }
        this._focusService.focusNext(this);
        this._dialogOpened = false;
        this.selectDialogClose.emit();
      });
  }

  private _genSelectDialogContext(): AppSelectDialogContext {
    const hintIsDialogTitle = _.toBoolean(this.hintIsDialogTitle);
    const title: string = (this.dialogTitle)
      ? this.dialogTitle
      : (hintIsDialogTitle) ? this.hint : this.label;

    return {
      items: this._getItemNames(),
      selectedIndexChange: this.selectedIndexChange,
      selectedIndex: this.selectedIndex,
      title
    };
  }

  private _getItemNames(): string[] {
    return this.items.map((__, idx: number) =>
      this._getItemName(idx)
    );
  }

  private _getItemName(idx: number): string {
    const item: RawSelectItem<T> = this.items[idx];
    return (typeof item === 'string') ? item : item.name;
  }

  private _deriveSelectedIdx(): number {
    const value: T = this.formControl.value;

    if (value) {
      this.selectedIndex = this.items.findIndex((__, idx: number) =>
        (this._getItemValue(idx) === value)
      );
    }

    if (!this.selectedIndex) {
      this.selectedIndex = 0;
    }
    return this.selectedIndex;
  }

  private _getItemValue(idx: number): T {
    return (typeof this.items[idx] === 'string')
      ? <any>this.items[idx]
      : this.items[idx].valueOf;
  }
}
