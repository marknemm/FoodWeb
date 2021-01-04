import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppMapComponent } from './app-map.component';

describe('AppMapComponent', () => {
  let component: AppMapComponent;
  let fixture: ComponentFixture<AppMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
