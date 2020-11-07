import { Component } from '@angular/core';
import { formProvider } from '~web/forms';
import { ProfileImgBaseComponent } from './profile-img.base.component';

@Component({
  selector: 'foodweb-profile-img',
  templateUrl: './profile-img.component.html',
  styleUrls: ['./profile-img.component.scss'],
  providers: formProvider(ProfileImgComponent)
})
export class ProfileImgComponent extends ProfileImgBaseComponent {

  get placeholderPadding(): number {
    return Math.ceil(this.size * (1 - this.fontSizeRatio) / 2);
  }

  onSelectFile(event: HTMLInputEvent) {
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
