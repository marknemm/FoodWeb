import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DonationStatusComponent } from './donation-status.component';

describe('DonationStatusComponent', () => {
  let component: DonationStatusComponent;
  let fixture: ComponentFixture<DonationStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DonationStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
