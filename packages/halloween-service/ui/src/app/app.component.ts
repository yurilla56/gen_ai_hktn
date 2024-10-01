import { Component, inject, OnInit } from '@angular/core';
import { NodeApiService } from "../shared/services/node-api.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'Halloween App';

  private readonly nodeApiService: NodeApiService = inject(NodeApiService);

  public ngOnInit(): void {
    this.nodeApiService.getCostumesAudio();
  }
}
