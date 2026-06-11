import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPaquete } from './formulario-paquete';

describe('FormularioPaquete', () => {
  let component: FormularioPaquete;
  let fixture: ComponentFixture<FormularioPaquete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioPaquete],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioPaquete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
