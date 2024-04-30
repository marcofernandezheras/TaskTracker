import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeSemanalComponent } from './informe-semanal.component';

describe('InformeSemanalComponent', () => {
  let component: InformeSemanalComponent;
  let fixture: ComponentFixture<InformeSemanalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformeSemanalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InformeSemanalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
