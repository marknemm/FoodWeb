import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageListFiltersSectionComponent } from './page-list-filters-section.component';

describe('PageListFiltersSectionComponent', () => {
  let component: PageListFiltersSectionComponent;
  let fixture: ComponentFixture<PageListFiltersSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageListFiltersSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageListFiltersSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
