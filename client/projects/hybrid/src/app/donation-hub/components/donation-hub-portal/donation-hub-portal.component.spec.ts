import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationHubNavigationComponent } from './donation-hub-navigation.component';

describe('DonationHubNavigationComponent', () => {
  let component: DonationHubNavigationComponent;
  let fixture: ComponentFixture<DonationHubNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHubNavigationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationHubNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
