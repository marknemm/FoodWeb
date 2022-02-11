import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageListToolbarComponent } from './page-list-toolbar.component';

describe('PageListToolbarComponent', () => {
  let component: PageListToolbarComponent;
  let fixture: ComponentFixture<PageListToolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PageListToolbarComponent ],

    }).compileComponents();

    fixture = TestBed.createComponent(PageListToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
