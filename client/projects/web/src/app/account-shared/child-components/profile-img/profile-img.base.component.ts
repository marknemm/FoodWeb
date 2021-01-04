import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { AccountProfileImgPlaceholder } from '~shared';
import { Convert, NumberConverter } from '~web/component-decorators';
import { FormBaseComponent, FormHelperService, TFormControl } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { ScreenSizeService, SizeThresholds } from '~web/shared/services/screen-size/screen-size.service';

@Component({ template: '' })
export class ProfileImgBaseComponent extends FormBaseComponent<string> implements OnInit {

  // Default is 40 (px) b/c mat-card-avatar defaults to this size.
  @Convert(NumberConverter)
  @Input() size: SizeThresholds | number = 40;

  @HostBinding()
  readonly class = 'foodweb-profile-img';

  protected readonly fontSizeRatio = 0.75;

  protected _currentSize = 0;
  protected _placeholder: AccountProfileImgPlaceholder = { backgroundColor: '', color: '', letter: '' };

  constructor(
    protected _constants: ConstantsService,
    protected _screenSizeService: ScreenSizeService,
    formHelperService: FormHelperService
  ) {
    super(new TFormControl<string>(), formHelperService);
  }

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

  /**
   * The profile image placeholder. If an image exists, then it will be a placeholder object containing properties set to empty strings.
   */
  get placeholder(): AccountProfileImgPlaceholder {
    return this._placeholder;
  }

  /**
   * Whether or not the placeholder should be used, based off of the presence of a user provided profile image.
   */
  get usePlaceholder(): boolean {
    return (!this.value || this.value.length <= 1);
  }

  ngOnInit() {
    this.monitorValue().subscribe((value: string) => {
      this._placeholder = (value?.length === 1)
        ? this._constants.ACCOUNT_PROFILE_IMG_PLACEHOLDERS[value.charAt(0)]
        : { backgroundColor: '', color: '', letter: '' };
    });

    this._currentSize = this._screenSizeService.getCurrentWidth(this.size);
    this._screenSizeService.onResize(this._destroy$).subscribe(() =>
      this._currentSize = this._screenSizeService.getCurrentWidth(this.size)
    );
  }
}
