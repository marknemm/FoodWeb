import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationPortalComponent } from './donation-portal.component';

describe('DonationPortalComponent', () => {
  let component: DonationPortalComponent;
  let fixture: ComponentFixture<DonationPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationPortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
