import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DonationTeaserComponent } from './donation-teaser.component';

describe('DonationTeaserComponent', () => {
  let component: DonationTeaserComponent;
  let fixture: ComponentFixture<DonationTeaserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DonationTeaserComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(DonationTeaserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
