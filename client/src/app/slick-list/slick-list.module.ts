import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdButtonModule } from '@angular/material';

import { SlickListItemComponent } from './slick-list-item/slick-list-item.component';
import { SlickListDialogComponent } from './slick-list-dialog/slick-list-dialog.component';


@NgModule({
    imports: [
        CommonModule,
        MdButtonModule
    ],
    declarations: [ 
        SlickListItemComponent,
        SlickListDialogComponent
    ],
    exports: [
        SlickListItemComponent,
        SlickListDialogComponent
    ]
})
export class SlickListModule { }
