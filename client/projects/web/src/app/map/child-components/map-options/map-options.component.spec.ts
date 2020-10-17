import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MapOptionsComponent } from './map-options.component';

describe('MapOptionsComponent', () => {
  let component: MapOptionsComponent;
  let fixture: ComponentFixture<MapOptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
