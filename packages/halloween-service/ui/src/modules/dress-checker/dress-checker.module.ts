import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DressCheckerRoutingModule } from './dress-checker-routing.module';
import { DressCheckerComponent } from "./dress-checker.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatIconModule } from "@angular/material/icon";
import { CameraComponent } from "./camera/camera.component";


@NgModule({
  declarations: [ DressCheckerComponent, CameraComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    DressCheckerRoutingModule,
    MatIconModule
  ]
})
export class DressCheckerModule {
}
