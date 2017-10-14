import { Component, Input, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs/Observable";

import { AbstractSlickListDialog } from './abstract-slick-list-dialog';


@Component({
    selector: 'slick-list-dialog',
    templateUrl: './slick-list-dialog.component.html',
    styleUrls: ['./slick-list-dialog.component.css']
})
export class SlickListDialogComponent extends AbstractSlickListDialog {

    @Input() private header;

    @ViewChild('SlickListDialogTemplate') private slickListDialogTemplate: HTMLTemplateElement;

    private modalDialogContainerRef: NgbModalRef;
    
    
    public constructor (
        private modalService: NgbModal
    ) {
        super();
        this.modalDialogContainerRef = null;
    }


    /**
     * Displays the listing details modal dialog.
     */
    public open(): void {

        const options: NgbModalOptions = {
            windowClass: 'slick-list-dialog' // This is important. It allows us to isolate styles to this modal dialog (they will not appear in login dialog)!
        };

        this.modalDialogContainerRef = this.modalService.open(this.slickListDialogTemplate, options);
        this.modalDialogContainerRef.result
            .then(() => {})
            .catch((err: Error) => {
                if (err)  console.log(err);
            });
    }


    /**
     * Checks if the dialog is open.
     * @return true if the dialog is open, false if not.
     */
    public isOpen(): boolean {
        return (this.modalDialogContainerRef != null);
    }


    /**
     * Hides (or closes) the listing details dialog.
     */
    public close(): void {
        this.modalDialogContainerRef.close();
        this.modalDialogContainerRef = null;
    }
}
