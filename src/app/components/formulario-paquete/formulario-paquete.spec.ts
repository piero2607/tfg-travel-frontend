import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormularioPaqueteComponent } from './formulario-paquete';   
describe('FormularioPaqueteComponent', () => {   
  let component: FormularioPaqueteComponent;
  let fixture: ComponentFixture<FormularioPaqueteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioPaqueteComponent],    
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioPaqueteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});