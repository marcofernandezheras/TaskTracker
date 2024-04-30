import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTareasPendientesComponent } from './lista-tareas-pendientes.component';

describe('ListaTareasPendientesComponent', () => {
  let component: ListaTareasPendientesComponent;
  let fixture: ComponentFixture<ListaTareasPendientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaTareasPendientesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaTareasPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
