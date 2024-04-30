import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DesarrollosComponent } from './desarrollos.component';

const routes: Routes = [
  {
    path: 'desarrollos',
    component: DesarrollosComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesarrollosRoutingModule {}
