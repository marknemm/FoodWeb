import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListSortComponent } from './list-sort.component';

describe('ListSortComponent', () => {
  let component: ListSortComponent<any>;
  let fixture: ComponentFixture<ListSortComponent<any>>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSortComponent ],

    }).compileComponents();

    fixture = TestBed.createComponent(ListSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
