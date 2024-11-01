import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { StorageService } from "../../shared/services/storage.service";
import { NodeApiService } from "../../shared/services/node-api.service";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { Animal } from "../../shared/models/common.models";
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly nodeApiService: NodeApiService = inject(NodeApiService);
  private readonly storageService: StorageService = inject(StorageService);
  private readonly router: Router = inject(Router);

  private readonly subscription: Subscription = new Subscription();

  private animals$$: BehaviorSubject<Animal[] | null> = new BehaviorSubject<Animal[] | null>(null);
  public animals$: Observable<Animal[] | null> = this.animals$$.asObservable();

  public baseUrl: string = '../../assets/animals/';

  public ngOnInit(): void {
    this.nodeApiService.getAnimals();

    this.subscription.add(this.storageService.animals$.subscribe(data => {
      const images = data || [];
      const animals: Animal[] = images.map(image => {
        const name = image.split('.')?.[0];
        return { image, name }
      });
      this.animals$$.next(animals);
    }))
  }

  public onAnimalClick(animalName: string): void {
    const imgElement = document.getElementById(animalName);

    if (imgElement) {
      imgElement.classList.add('bounce');

      setTimeout(() => {
        this.router.navigate(['/costumes'], { queryParams: { name: animalName } });
      }, 500);
    }
  }

  // @Todo: specify the target
  public goToParentApp(): void {
    window.parent.postMessage({ action: 'navigateBack' }, '*');
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
