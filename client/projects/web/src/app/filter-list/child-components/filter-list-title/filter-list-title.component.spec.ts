import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterListTitleComponent } from './filter-list-title.component';

describe('FilterListTitleComponent', () => {
  let component: FilterListTitleComponent;
  let fixture: ComponentFixture<FilterListTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterListTitleComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterListTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
