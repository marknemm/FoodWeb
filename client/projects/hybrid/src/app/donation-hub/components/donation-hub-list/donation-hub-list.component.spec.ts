import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationHubListComponent } from './donation-hub-list.component';

describe('DonationHubListComponent', () => {
  let component: DonationHubListComponent;
  let fixture: ComponentFixture<DonationHubListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHubListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationHubListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
