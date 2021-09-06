import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationHubComponent } from './donation-hub.component';

describe('DonationHubComponent', () => {
  let component: DonationHubComponent;
  let fixture: ComponentFixture<DonationHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
