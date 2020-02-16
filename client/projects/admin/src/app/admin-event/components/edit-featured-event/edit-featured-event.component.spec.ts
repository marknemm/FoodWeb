import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { EditFeaturedEventComponent } from './edit-featured-event.component';

describe('EditFeaturedEventComponent', () => {
  let component: EditFeaturedEventComponent;
  let fixture: ComponentFixture<EditFeaturedEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFeaturedEventComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditFeaturedEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
