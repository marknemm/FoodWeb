import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { AccountProfileImgPlaceholder } from '~shared';
import { Convert } from '~web/component-decorators';
import { FormBaseComponent, FormHelperService, TFormControl } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({ template: '' })
export class ProfileImgBaseComponent extends FormBaseComponent<string> implements OnInit {

  // Default is 40 (px) b/c mat-card-avatar defaults to this size.
  @Convert()
  @Input() size: number = 40;

  @HostBinding()
  readonly class = 'foodweb-profile-img';

  protected readonly fontSizeRatio = 0.75;

  protected _placeholder: AccountProfileImgPlaceholder = { backgroundColor: '', color: '', letter: '' };

  constructor(
    protected _constants: ConstantsService,
    formHelperService: FormHelperService
  ) {
    super(new TFormControl<string>(), formHelperService);
  }

  get fontSize(): number {
    return Math.floor(this.size * this.fontSizeRatio);
  }

  get placeholder(): AccountProfileImgPlaceholder {
    return this._placeholder;
  }

  get usePlaceholder(): boolean {
    return (!this.value || this.value.length <= 1);
  }

  ngOnInit() {
    this.monitorValue().subscribe((value: string) => {
      this._placeholder = (value?.length === 1)
        ? this._constants.ACCOUNT_PROFILE_IMG_PLACEHOLDERS[value.charAt(0)]
        : { backgroundColor: '', color: '', letter: '' };
    });
  }
}
