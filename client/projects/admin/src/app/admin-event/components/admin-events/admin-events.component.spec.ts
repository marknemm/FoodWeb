import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FeaturedEventsComponent } from './featured-events.component';

describe('FeaturedEventsComponent', () => {
  let component: FeaturedEventsComponent;
  let fixture: ComponentFixture<FeaturedEventsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturedEventsComponent ],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturedEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
