import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimarySettingsComponent } from './primary-settings.component';

describe('PrimarySettingsComponent', () => {
  let component: PrimarySettingsComponent;
  let fixture: ComponentFixture<PrimarySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimarySettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimarySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
