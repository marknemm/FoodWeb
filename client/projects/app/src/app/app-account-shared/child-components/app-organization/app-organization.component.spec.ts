import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppOrganizationComponent } from './app-organization.component';

describe('AppOrganizationComponent', () => {
  let component: AppOrganizationComponent;
  let fixture: ComponentFixture<AppOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppOrganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
