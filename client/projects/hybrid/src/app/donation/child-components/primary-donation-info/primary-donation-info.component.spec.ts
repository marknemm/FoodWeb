import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryDonationInfoComponent } from './primary-donation-info.component';

describe('PrimaryDonationInfoComponent', () => {
  let component: PrimaryDonationInfoComponent;
  let fixture: ComponentFixture<PrimaryDonationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryDonationInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryDonationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
