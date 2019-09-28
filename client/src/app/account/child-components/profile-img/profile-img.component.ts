import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'food-web-profile-img',
  templateUrl: './profile-img.component.html',
  styleUrls: ['./profile-img.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ProfileImgComponent), multi: true },
  ]
})
export class ProfileImgComponent implements OnInit, ControlValueAccessor {

  @Input() editable = false;
  @Input() editing = false;
  @Input() width = '150px';
  @Input() height = '150px';

  private _imgUrl = '';
  private _onChangeCb: (value: string) => void = () => {};

  constructor() {}

  get imgUrl(): string {
    return this._imgUrl;
  }

  ngOnInit() {}

  writeValue(value: string): void {
    this._imgUrl = value;
  }

  registerOnChange(onChangeCb: (value: string) => void): void {
    this._onChangeCb = onChangeCb;
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: ProgressEvent) => {
        this._imgUrl = event.target['result'];
        this._onChangeCb(this.imgUrl);
      }
    }
  }

  registerOnTouched(): void {}
}
