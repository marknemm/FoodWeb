import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { AccountProfileImgPlaceholder } from '~shared';
import { FormFieldService, TFormControl } from '~web/forms';
import { SizeThresholds } from '~web/shared/interfaces/size-thresholds';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { ScreenSizeService } from '~web/shared/services/screen-size/screen-size.service';

@Component({
  selector: 'foodweb-profile-img',
  templateUrl: './profile-img.component.html',
  styleUrls: ['./profile-img.component.scss'],
  providers: [FormFieldService]
})
export class ProfileImgComponent implements OnInit {

  @Input() editable = false;
  @Input() size: SizeThresholds | number = 40; // Default is 40 (px) b/c mat-card-avatar defaults to this size.
  @Input() get value(): string      { return this._formFieldService.value; }
           set value(value: string) { this._formFieldService.valueIn(value); }

  @HostBinding()
  readonly class = 'foodweb-profile-img';

  protected readonly fontSizeRatio = 0.75;

  protected _currentSize = 0;
  protected _placeholder: AccountProfileImgPlaceholder = { backgroundColor: '', color: '', letter: '' };

  constructor(
    protected _constants: ConstantsService,
    protected _screenSizeService: ScreenSizeService,
    private _formFieldService: FormFieldService<string>
  ) {}

  /**
   * The current size (diameter) of the profile image based on the current viewport size.
   */
  get currentSize(): number {
    return this._currentSize;
  }

  /**
   * The font size of the profile image placeholder.
   */
  get fontSize(): number {
    return Math.floor(this.currentSize * this.fontSizeRatio);
  }

  get formControl(): TFormControl<string> {
    return this._formFieldService.control;
  }

  /**
   * The profile image placeholder. If an image exists, then it will be a placeholder object containing properties set to empty strings.
   */
  get placeholder(): AccountProfileImgPlaceholder {
    return this._placeholder;
  }

  get placeholderPadding(): number {
    return Math.ceil(this.currentSize * (1 - this.fontSizeRatio) / 2);
  }

  /**
   * Whether or not the placeholder should be used, based off of the presence of a user provided profile image.
   */
  get usePlaceholder(): boolean {
    return (!this.value || this.value.length <= 1);
  }

  ngOnInit(): void {
    this._formFieldService.injectControl();

    this._formFieldService.value$.subscribe((value: string) => {
      this._placeholder = (value?.length === 1)
        ? this._constants.ACCOUNT_PROFILE_IMG_PLACEHOLDERS[value.charAt(0)]
        : { backgroundColor: '', color: '', letter: '' };
    });

    this._currentSize = this._screenSizeService.getCurrentWidth(this.size);
    this._screenSizeService.onResize(this._formFieldService.destroy$).subscribe(() =>
      this._currentSize = this._screenSizeService.getCurrentWidth(this.size)
    );
  }

  onSelectFile(event: HTMLInputEvent): void {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (progressEvent: ProgressEvent) =>
        this.formControl.setValue((<any>progressEvent.target).result);
    }
  }
}

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
