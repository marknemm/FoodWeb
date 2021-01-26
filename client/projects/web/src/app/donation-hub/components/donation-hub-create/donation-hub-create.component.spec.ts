import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonationHubCreateComponent } from './donation-hub-create.component';

describe('DonationHubCreateComponent', () => {
  let component: DonationHubCreateComponent;
  let fixture: ComponentFixture<DonationHubCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationHubCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationHubCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
