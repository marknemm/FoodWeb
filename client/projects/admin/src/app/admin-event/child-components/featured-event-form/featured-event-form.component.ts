import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FeaturedEventForm } from '~admin/admin-event/forms/featured-event.form';
import { FeaturedEvent } from '~shared';
import { Convert } from '~web/component-decorators';

@Component({
  selector: 'foodweb-admin-featured-event-form',
  templateUrl: './featured-event-form.component.html',
  styleUrls: ['./featured-event-form.component.scss'],
})
export class FeaturedEventFormComponent implements OnInit, OnChanges {

  @Input() formTitle = '';
  @Input() featuredEvent: Partial<FeaturedEvent>;
  @Convert()
  @Input() excludeDelete: boolean = false;

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
    if (this.featuredEventForm.checkValidity()) {
      this.save.emit(this.featuredEventForm.submitValue);
    }
  }

}
