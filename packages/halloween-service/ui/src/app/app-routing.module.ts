import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: "full", redirectTo: '/home' },
  { path: 'home', loadChildren: () => import('../modules/home/home.module').then(m => m.HomeModule) },
  {
    path: 'dress-checker',
    loadChildren: () => import('../modules/dress-checker/dress-checker.module').then(m => m.DressCheckerModule)
  },
  {
    path: 'costumes',
    loadChildren: () => import('../modules/costumes/costumes.module').then(m => m.CostumesModule)
  },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}
