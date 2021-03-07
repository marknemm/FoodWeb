import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredListInstructionsComponent } from './filtered-list-instructions.component';

describe('FilteredListInstructionsComponent', () => {
  let component: FilteredListInstructionsComponent;
  let fixture: ComponentFixture<FilteredListInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilteredListInstructionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilteredListInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
