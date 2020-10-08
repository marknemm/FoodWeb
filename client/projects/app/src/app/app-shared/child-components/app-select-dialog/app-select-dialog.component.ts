import { Component, EventEmitter, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';

@Component({
  selector: 'foodweb-app-select-dialog',
  templateUrl: './app-select-dialog.component.html',
  styleUrls: ['./app-select-dialog.component.scss']
})
export class AppSelectDialogComponent implements OnInit {

  constructor(
    public modalDialogParams: ModalDialogParams
  ) {}

  get context(): AppSelectDialogContext {
    return this.modalDialogParams.context;
  }

  get items(): string[] {
    return this.context.items;
  }

  get selectedIndex(): number {
    return this.context.selectedIndex;
  }

  get title(): string {
    return this.context.title;
  }

  ngOnInit() {}

  onSelectedIndexChange(idx: number): void {
    this.context.selectedIndex = idx;
    this.context.selectedIndexChange.emit(idx);
  }

  close(selectedIdx?: number): void {
    this.modalDialogParams.closeCallback(selectedIdx);
  }
}

export interface AppSelectDialogContext {
  items: string[];
  selectedIndexChange: EventEmitter<number>;
  selectedIndex: number;
  title: string;
}
