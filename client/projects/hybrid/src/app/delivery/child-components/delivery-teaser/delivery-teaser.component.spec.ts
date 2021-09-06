import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryTeaserComponent } from './delivery-teaser.component';

describe('DeliveryTeaserComponent', () => {
  let component: DeliveryTeaserComponent;
  let fixture: ComponentFixture<DeliveryTeaserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryTeaserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryTeaserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
