import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDateComponent } from './app-date.component';

describe('AppDateComponent', () => {
  let component: AppDateComponent;
  let fixture: ComponentFixture<AppDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
