import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppActionBarComponent } from './app-action-bar.component';

describe('AppActionBarComponent', () => {
  let component: AppActionBarComponent;
  let fixture: ComponentFixture<AppActionBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppActionBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
