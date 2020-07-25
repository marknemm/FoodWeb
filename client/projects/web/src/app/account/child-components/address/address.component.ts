import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ContactInfo } from '~shared';
import { MapAppLinkService } from '~web/map/map-app-link/map-app-link.service';

@Component({
  selector: 'foodweb-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, OnChanges {

  @Input() contactInfo: ContactInfo;
  @Input() mapAnchorType: MapAnchorType = 'Directions';

  private _mapAnchor = '';

  constructor(
    private _mapAppLinkService: MapAppLinkService
  ) {}

  get mapAnchor(): string {
    return this._mapAnchor;
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.contactInfo || changes.mapAnchorType) {
      switch (this.mapAnchorType) {
        case 'Directions':  this._mapAnchor = this._mapAppLinkService.genDirectionHref(['My+Location', this.contactInfo]);  break;
        case 'Location':    this._mapAnchor = this._mapAppLinkService.genLocationHref(this.contactInfo);                    break;
        case 'None':
        default:            this._mapAnchor = '';
      }
    }
  }

}

export type MapAnchorType = 'Directions' | 'Location' | 'None';
