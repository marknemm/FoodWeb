import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateAccountComponent } from './create-account.component';

describe('CreateAccountComponent', () => {
  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAccountComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
