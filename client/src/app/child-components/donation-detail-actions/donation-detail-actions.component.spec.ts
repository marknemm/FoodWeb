import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationDetailActionsComponent } from './donation-detail-actions.component';

describe('DonationDetailActionsComponent', () => {
  let component: DonationDetailActionsComponent;
  let fixture: ComponentFixture<DonationDetailActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonationDetailActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationDetailActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
