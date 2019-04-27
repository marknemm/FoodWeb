import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationStatusComponent } from './donation-status.component';

describe('DonationStatusComponent', () => {
  let component: DonationStatusComponent;
  let fixture: ComponentFixture<DonationStatusComponent>;

  beforeEach(async(() => {
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
