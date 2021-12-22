import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonationHubActionsComponent } from './donation-hub-actions.component';

describe('DonationHubActionsComponent', () => {
  let component: DonationHubActionsComponent;
  let fixture: ComponentFixture<DonationHubActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHubActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationHubActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
