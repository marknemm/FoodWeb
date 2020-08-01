import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FeaturedEventForm } from '~admin/admin-event/forms/featured-event.form';
import { FeaturedEvent } from '~shared';

@Component({
  selector: 'foodweb-admin-featured-event-form',
  templateUrl: './featured-event-form.component.html',
  styleUrls: ['./featured-event-form.component.scss'],
})
export class FeaturedEventFormComponent implements OnInit, OnChanges {

  @Input() formTitle = '';
  @Input() featuredEvent: Partial<FeaturedEvent>;
  @Input() excludeDelete = false;

  @Output() delete = new EventEmitter<void>();
  @Output() save = new EventEmitter<FeaturedEvent>();

  readonly featuredEventForm = new FeaturedEventForm();

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.featuredEvent) {
      (this.featuredEvent)
        ? this.featuredEventForm.patchValue(this.featuredEvent)
        : this.featuredEventForm.reset();
    }
  }

  onSubmit(): void {
    this.featuredEventForm.markAllAsTouched();
    if (this.featuredEventForm.valid) {
      this.save.emit(this.featuredEventForm.submitValue);
    }
  }

}
