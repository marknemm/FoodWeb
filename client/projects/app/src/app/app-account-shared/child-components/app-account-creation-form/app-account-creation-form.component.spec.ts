import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAccountCreationFormComponent } from './app-account-creation-form.component';

describe('AppAccountCreationFormComponent', () => {
  let component: AppAccountCreationFormComponent;
  let fixture: ComponentFixture<AppAccountCreationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppAccountCreationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAccountCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
