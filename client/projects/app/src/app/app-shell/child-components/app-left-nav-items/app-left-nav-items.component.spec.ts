import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLeftNavItemsComponent } from './app-left-nav-items.component';

describe('AppLeftNavItemsComponent', () => {
  let component: AppLeftNavItemsComponent;
  let fixture: ComponentFixture<AppLeftNavItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppLeftNavItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLeftNavItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
