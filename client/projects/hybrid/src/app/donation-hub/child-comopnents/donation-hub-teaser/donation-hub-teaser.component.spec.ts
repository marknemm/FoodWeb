import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationHubTeaserComponent } from './donation-hub-teaser.component';

describe('DonationHubTeaserComponent', () => {
  let component: DonationHubTeaserComponent;
  let fixture: ComponentFixture<DonationHubTeaserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHubTeaserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationHubTeaserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
