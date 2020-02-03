import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterListFiltersTitleComponent } from './filter-list-filters-title.component';

describe('FilterListFiltersTitleComponent', () => {
  let component: FilterListFiltersTitleComponent;
  let fixture: ComponentFixture<FilterListFiltersTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterListFiltersTitleComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterListFiltersTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
