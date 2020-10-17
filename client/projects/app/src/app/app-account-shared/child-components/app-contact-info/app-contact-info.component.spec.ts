import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppContactInfoComponent } from './app-contact-info.component';

describe('AppContactInfoComponent', () => {
  let component: AppContactInfoComponent;
  let fixture: ComponentFixture<AppContactInfoComponent>;

  beforeEach(waitForAsync(() => {
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
