import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredListToolbarComponent } from './filtered-list-toolbar.component';

describe('FilteredListToolbarComponent', () => {
  let component: FilteredListToolbarComponent;
  let fixture: ComponentFixture<FilteredListToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilteredListToolbarComponent ],

    }).compileComponents();

    fixture = TestBed.createComponent(FilteredListToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
