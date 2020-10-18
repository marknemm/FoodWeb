import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppEditSaveButtonComponent } from './app-edit-save-button.component';

describe('AppEditSaveButtonComponent', () => {
  let component: AppEditSaveButtonComponent;
  let fixture: ComponentFixture<AppEditSaveButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppEditSaveButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppEditSaveButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
