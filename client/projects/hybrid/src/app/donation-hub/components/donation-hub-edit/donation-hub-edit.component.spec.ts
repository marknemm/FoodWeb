import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationHubEditComponent } from './donation-hub-edit.component';

describe('DonationHubEditComponent', () => {
  let component: DonationHubEditComponent;
  let fixture: ComponentFixture<DonationHubEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHubEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationHubEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
