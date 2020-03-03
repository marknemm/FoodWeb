import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FilterListToolbarItemsComponent } from './filter-list-toolbar-items.component';

describe('FilterListToolbarItemsComponent', () => {
  let component: FilterListToolbarItemsComponent;
  let fixture: ComponentFixture<FilterListToolbarItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterListToolbarItemsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterListToolbarItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
