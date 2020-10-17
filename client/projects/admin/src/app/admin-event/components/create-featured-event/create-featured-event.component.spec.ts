import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateFeaturedEventComponent } from './create-featured-event.component';

describe('CreateFeaturedEventComponent', () => {
  let component: CreateFeaturedEventComponent;
  let fixture: ComponentFixture<CreateFeaturedEventComponent>;

  beforeEach(async(() => {
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
