import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonationHubDropOffInfoComponent } from './donation-hub-drop-off-info.component';

describe('DonationHubDropOffInfoComponent', () => {
  let component: DonationHubDropOffInfoComponent;
  let fixture: ComponentFixture<DonationHubDropOffInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHubDropOffInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationHubDropOffInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
