import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EditFeaturedEventComponent } from './edit-featured-event.component';

describe('EditFeaturedEventComponent', () => {
  let component: EditFeaturedEventComponent;
  let fixture: ComponentFixture<EditFeaturedEventComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFeaturedEventComponent ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditFeaturedEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
