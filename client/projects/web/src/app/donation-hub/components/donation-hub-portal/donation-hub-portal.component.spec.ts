import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationHubPortalComponent } from './donation-hub-portal.component';

describe('DonationHubPortalComponent', () => {
  let component: DonationHubPortalComponent;
  let fixture: ComponentFixture<DonationHubPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHubPortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationHubPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
