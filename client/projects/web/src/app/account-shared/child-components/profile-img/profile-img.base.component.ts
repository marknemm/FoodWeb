import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { AccountProfileImgPlaceholder } from '~shared';
import { FormBaseComponent } from '~web/data-structure/form-base-component';
import { TFormControl } from '~web/data-structure/t-form-control';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({ template: '' })
export class ProfileImgBaseComponent extends FormBaseComponent<string> implements OnInit {

  // Default is 40 (px) b/c mat-card-avatar defaults to this size.
  @Input() size = 40;

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
