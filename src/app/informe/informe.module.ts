import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InformeRoutingModule } from './informe-routing.module'
import { InformeComponent } from './informe.component';
import { InformeSemanalComponent } from './informe-semanal/informe-semanal.component';
import { CalendarModule } from 'primeng/calendar';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [InformeComponent, InformeSemanalComponent],
  imports: [
    CommonModule, SharedModule, InformeRoutingModule, ToggleButtonModule, CalendarModule, AccordionModule, TableModule
  ]
})
export class InformeModule { }
