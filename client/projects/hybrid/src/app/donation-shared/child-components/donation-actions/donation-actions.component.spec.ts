import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationActionsComponent } from './donation-actions.component';

describe('DonationActionsComponent', () => {
  let component: DonationActionsComponent;
  let fixture: ComponentFixture<DonationActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
