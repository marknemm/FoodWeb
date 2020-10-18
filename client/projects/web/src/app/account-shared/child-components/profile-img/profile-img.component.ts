import { Component } from '@angular/core';
import { formProvider } from '~web/data-structure/form-base-component';
import { ProfileImgBaseComponent } from './profile-img.base.component';

@Component({
  selector: 'foodweb-profile-img',
  templateUrl: './profile-img.component.html',
  styleUrls: ['./profile-img.component.scss'],
  providers: formProvider(ProfileImgComponent)
})
export class ProfileImgComponent extends ProfileImgBaseComponent {

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
