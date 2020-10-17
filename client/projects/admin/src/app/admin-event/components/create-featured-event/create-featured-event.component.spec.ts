import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CreateFeaturedEventComponent } from './create-featured-event.component';

describe('CreateFeaturedEventComponent', () => {
  let component: CreateFeaturedEventComponent;
  let fixture: ComponentFixture<CreateFeaturedEventComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFeaturedEventComponent ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateFeaturedEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
