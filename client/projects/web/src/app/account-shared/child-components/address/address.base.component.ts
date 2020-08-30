import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ContactInfo } from '~shared';
import { MapAnchorType } from '~web/map/interfaces/map';
import { MapAppLinkService } from '~web/map/services/map-app-link/map-app-link.service';

@Component({ template: '' })
export class AddressBaseComponent implements OnInit, OnChanges {

  @Input() contactInfo: ContactInfo;
  @Input() mapAnchorType: MapAnchorType = 'Directions';

  protected _mapAnchor = '';

  constructor(
    protected _mapAppLinkService: MapAppLinkService
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
