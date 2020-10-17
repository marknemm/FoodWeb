import { Component, Input, OnInit } from '@angular/core';
import { AccountProfileImgPlaceholder } from '~shared';
import { FormBaseComponent, formProvider } from '~web/data-structure/form-base-component';
import { TFormControl } from '~web/data-structure/t-form-control';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({
  selector: 'foodweb-profile-img',
  templateUrl: './profile-img.component.html',
  styleUrls: ['./profile-img.component.scss'],
  providers: formProvider(ProfileImgComponent)
})
export class ProfileImgComponent extends FormBaseComponent<string> implements OnInit {

  @Input() accountName = '';
  @Input() height = '150px';
  @Input() width = '150px';

  private _placeholder: AccountProfileImgPlaceholder = { backgroundColor: '', color: '', letter: '' };

  constructor(
    private _constants: ConstantsService,
    formHelperService: FormHelperService
  ) {
    super(new TFormControl<string>(), formHelperService);
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

  onSelectFile(event: HTMLInputEvent) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (progressEvent: ProgressEvent) =>
        this.formControl.setValue((<any>progressEvent.target).result);
    }
  }

  calcPlaceholderFontSizePx(placeholderHeightPx: number): number {
    return Math.floor(placeholderHeightPx - (placeholderHeightPx * 0.4));
  }

  calcPlaceholderPaddingPx(placeholderHeightPx: number): number {
    return Math.ceil(placeholderHeightPx * 0.2);
  }
}

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
