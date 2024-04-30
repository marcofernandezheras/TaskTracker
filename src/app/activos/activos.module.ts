import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivosComponent } from './activos.component';
import { SharedModule } from '../shared/shared.module';
import { ActivosRoutingModule } from './activos-routing.module';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [ActivosComponent],
  imports: [
    CommonModule, SharedModule, ActivosRoutingModule,
    TableModule, ButtonModule, RippleModule, InputTextModule, ToastModule
  ],
  providers: [MessageService]
})
export class ActivosModule { }
