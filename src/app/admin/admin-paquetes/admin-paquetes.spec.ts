import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPaquetesComponent } from './admin-paquetes';   

describe('AdminPaquetesComponent', () => {   
  let component: AdminPaquetesComponent;
  let fixture: ComponentFixture<AdminPaquetesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPaquetesComponent],    
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPaquetesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});