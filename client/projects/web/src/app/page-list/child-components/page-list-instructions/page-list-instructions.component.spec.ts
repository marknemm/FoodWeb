import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageListInstructionsComponent } from './page-list-instructions.component';

describe('PageListInstructionsComponent', () => {
  let component: PageListInstructionsComponent;
  let fixture: ComponentFixture<PageListInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageListInstructionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageListInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
