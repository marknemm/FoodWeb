import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PageListSortComponent } from './page-list-sort.component';

describe('PageListSortComponent', () => {
  let component: PageListSortComponent<any>;
  let fixture: ComponentFixture<PageListSortComponent<any>>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PageListSortComponent ],

    }).compileComponents();

    fixture = TestBed.createComponent(PageListSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
