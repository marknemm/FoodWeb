import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppMapOptionsComponent } from './app-map-options.component';

describe('AppMapOptionsComponent', () => {
  let component: AppMapOptionsComponent;
  let fixture: ComponentFixture<AppMapOptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppMapOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppMapOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
