import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationTeaserComponent } from './donation-teaser.component';

describe('DonationTeaserComponent', () => {
  let component: DonationTeaserComponent;
  let fixture: ComponentFixture<DonationTeaserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationTeaserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationTeaserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
