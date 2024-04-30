import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { DesarrollosRoutingModule } from './desarrollos-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DesarrollosComponent } from './desarrollos.component';
import { DropdownModule } from 'primeng/dropdown';
import { ChipModule } from 'primeng/chip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [DesarrollosComponent],
  imports: [
    CommonModule, SharedModule, DesarrollosRoutingModule,
    TableModule, ButtonModule, RippleModule, DropdownModule, InputTextModule, ChipModule, ToastModule
  ],
  providers: [MessageService]
})
export class DesarrollosModule { }
