import { Component } from '@angular/core';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrl: './informe.component.scss'
})
export class InformeComponent {
  activeSection = {
    porDesarrollo: true
  }
}
