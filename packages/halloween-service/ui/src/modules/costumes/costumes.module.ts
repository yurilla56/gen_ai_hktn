import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CostumesRoutingModule } from './costumes-routing.module';
import { CostumesComponent } from './costumes.component';
import { MatTooltipModule } from "@angular/material/tooltip";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatIconModule } from "@angular/material/icon";


@NgModule({
  declarations: [
    CostumesComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatIconModule,
    CostumesRoutingModule,
  ]
})
export class CostumesModule { }
