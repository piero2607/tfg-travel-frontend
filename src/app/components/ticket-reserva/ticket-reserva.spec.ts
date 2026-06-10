import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketReserva } from './ticket-reserva';

describe('TicketReserva', () => {
  let component: TicketReserva;
  let fixture: ComponentFixture<TicketReserva>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketReserva],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketReserva);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
