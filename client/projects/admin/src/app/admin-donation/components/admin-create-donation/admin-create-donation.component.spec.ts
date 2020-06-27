import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import 'jasmine';
import { AdminCreateDonationComponent } from './admin-create-donation.component';

describe('AdminCreateDonationComponent', () => {
  let component: AdminCreateDonationComponent;
  let fixture: ComponentFixture<AdminCreateDonationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCreateDonationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCreateDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
