import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { EventForm } from '~admin/admin-event/forms/event.form';
import { FeaturedEvent } from '~shared';

@Component({
  selector: 'foodweb-admin-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent implements OnInit, OnChanges {

  @Input() formTitle = '';
  @Input() event: Partial<FeaturedEvent>;
  @Input() excludeDelete = false;

  @Output() delete = new EventEmitter<void>();
  @Output() save = new EventEmitter<FeaturedEvent>();

  readonly eventForm = new EventForm();

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.event) {
      (this.event)
        ? this.eventForm.patchValue(this.event)
        : this.eventForm.reset();
    }
  }

  onSubmit(): void {
    if (this.eventForm.checkValidity()) {
      this.save.emit(this.eventForm.submitValue);
    }
  }

}
