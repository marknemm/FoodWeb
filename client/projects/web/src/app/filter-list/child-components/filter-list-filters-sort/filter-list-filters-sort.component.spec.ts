import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FilterListFiltersSortComponent } from './filter-list-filters-sort.component';

describe('FilterListFiltersSortComponent', () => {
  let component: FilterListFiltersSortComponent;
  let fixture: ComponentFixture<FilterListFiltersSortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterListFiltersSortComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterListFiltersSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
