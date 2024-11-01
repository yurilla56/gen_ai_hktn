import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DressCheckerComponent } from "./dress-checker.component";

const routes: Routes = [ {path: '', component: DressCheckerComponent} ];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class DressCheckerRoutingModule {
}
