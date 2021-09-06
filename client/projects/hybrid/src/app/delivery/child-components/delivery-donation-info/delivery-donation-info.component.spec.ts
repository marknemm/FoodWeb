import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryDonationInfoComponent } from './delivery-donation-info.component';

describe('DeliveryDonationInfoComponent', () => {
  let component: DeliveryDonationInfoComponent;
  let fixture: ComponentFixture<DeliveryDonationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryDonationInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryDonationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
