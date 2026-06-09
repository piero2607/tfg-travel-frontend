import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPaquetes } from './lista-paquetes';

describe('ListaPaquetes', () => {
  let component: ListaPaquetes;
  let fixture: ComponentFixture<ListaPaquetes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPaquetes],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaPaquetes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
