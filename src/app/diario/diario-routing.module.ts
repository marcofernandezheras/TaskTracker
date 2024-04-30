import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DiarioComponent } from './diario.component';

const routes: Routes = [
  {
    path: 'diario',
    component: DiarioComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiarioRoutingModule {}
