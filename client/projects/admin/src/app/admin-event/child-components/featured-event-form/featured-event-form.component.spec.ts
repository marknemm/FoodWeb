import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FeaturedEventFormComponent } from './featured-event-form.component';

describe('FeaturedEventFormComponent', () => {
  let component: FeaturedEventFormComponent;
  let fixture: ComponentFixture<FeaturedEventFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturedEventFormComponent ],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturedEventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
