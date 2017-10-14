import { Component, Input } from '@angular/core';

@Component({
    selector: 'slick-list-item',
    templateUrl: './slick-list-item.component.html',
    styleUrls: ['./slick-list-item.component.css']
})
export class SlickListItemComponent {

    @Input() private includeDivider = true;

    constructor() { }
}
