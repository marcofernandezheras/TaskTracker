import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { SharedModule } from '../shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { ChipModule } from 'primeng/chip';
import { AccordionModule } from 'primeng/accordion';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';

import { DiarioRoutingModule } from './diario-routing.module';
import { DiarioComponent } from './diario.component';
import { ListaTareasComponent } from './lista-tareas/lista-tareas.component';
import { ListaTareasPendientesComponent } from './lista-tareas-pendientes/lista-tareas-pendientes.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [DiarioComponent, ListaTareasComponent, ListaTareasPendientesComponent],
  imports: [
    CommonModule, SharedModule, DiarioRoutingModule,
    TableModule, ButtonModule, RippleModule, DropdownModule, 
    InputTextModule, ChipModule, AccordionModule, ToggleButtonModule,
    CalendarModule, InputNumberModule, BadgeModule, ToastModule, ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class DiarioModule { }
