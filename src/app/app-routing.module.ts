import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import { ActivosRoutingModule } from './activos/activos-routing.module';
import { DesarrollosRoutingModule } from './desarrollos/desarrollos-routing.module';
import { DiarioRoutingModule } from './diario/diario-routing.module';
import { InformeRoutingModule } from './informe/informe-routing.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'activos',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {}),
    ActivosRoutingModule,
    DesarrollosRoutingModule,
    DiarioRoutingModule,
    InformeRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
