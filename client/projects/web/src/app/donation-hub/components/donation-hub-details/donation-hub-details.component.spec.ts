import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationHubDetailsComponent } from './donation-hub-details.component';

describe('DonationHubDetailsComponent', () => {
  let component: DonationHubDetailsComponent;
  let fixture: ComponentFixture<DonationHubDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHubDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationHubDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
