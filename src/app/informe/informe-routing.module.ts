import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { InformeComponent } from './informe.component';

const routes: Routes = [
  {
    path: 'informe',
    component: InformeComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformeRoutingModule {}
