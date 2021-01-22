import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredListEmptyComponent } from './filtered-list-empty.component';

describe('FilteredListEmptyComponent', () => {
  let component: FilteredListEmptyComponent;
  let fixture: ComponentFixture<FilteredListEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilteredListEmptyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilteredListEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
