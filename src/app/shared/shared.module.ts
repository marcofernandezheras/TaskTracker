import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from './components/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, NavBarComponent],
  imports: [CommonModule, TranslateModule, FormsModule, RouterModule],
  exports: [TranslateModule, WebviewDirective, FormsModule, NavBarComponent]
})
export class SharedModule {}

