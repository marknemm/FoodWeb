import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { LeftNavItemsComponent } from './left-nav-items.component';

describe('LeftNavItemsComponent', () => {
  let component: LeftNavItemsComponent;
  let fixture: ComponentFixture<LeftNavItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftNavItemsComponent ],

    }).compileComponents();

    fixture = TestBed.createComponent(LeftNavItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
