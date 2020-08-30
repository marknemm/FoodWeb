import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppContactInfoComponent } from './app-contact-info.component';

describe('AppContactInfoComponent', () => {
  let component: AppContactInfoComponent;
  let fixture: ComponentFixture<AppContactInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppContactInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppContactInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
