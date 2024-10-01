import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CostumesComponent } from "./costumes.component";

const routes: Routes = [ {path: '', component: CostumesComponent} ];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CostumesRoutingModule {
}
