import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationHubPledgeMiniListComponent } from './donation-hub-pledge-mini-list.component';

describe('DonationHubPledgeMiniListComponent', () => {
  let component: DonationHubPledgeMiniListComponent;
  let fixture: ComponentFixture<DonationHubPledgeMiniListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHubPledgeMiniListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationHubPledgeMiniListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
