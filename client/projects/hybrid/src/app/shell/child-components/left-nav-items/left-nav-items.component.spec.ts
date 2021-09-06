import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';


import { LeftNavItemsComponent } from './left-nav-items.component';

describe('LeftNavItemsComponent', () => {
  let component: LeftNavItemsComponent;
  let fixture: ComponentFixture<LeftNavItemsComponent>;

  beforeEach(waitForAsync(() => {
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
