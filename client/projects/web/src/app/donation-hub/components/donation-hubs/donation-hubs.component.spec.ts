import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationHubsComponent } from './donation-hubs.component';

describe('DonationHubsComponent', () => {
  let component: DonationHubsComponent;
  let fixture: ComponentFixture<DonationHubsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHubsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationHubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
