import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { NodeApiService } from "../../shared/services/node-api.service";
import { StorageService } from "../../shared/services/storage.service";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { Animal } from "../../shared/models/common.models";

@Component({
  selector: 'app-costumes',
  templateUrl: './costumes.component.html',
  styleUrls: [ './costumes.component.less' ]
})
export class CostumesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('backgroundAudio') backgroundAudio!: ElementRef<HTMLAudioElement>;

  private readonly nodeApiService: NodeApiService = inject(NodeApiService);
  private readonly storageService: StorageService = inject(StorageService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  private readonly subscription: Subscription = new Subscription();

  private costumes$$: BehaviorSubject<Animal[] | null> = new BehaviorSubject<Animal[] | null>(null);
  public costumes$: Observable<Animal[] | null> = this.costumes$$.asObservable();

  private audioPath$$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public audioPath$: Observable<string | null> = this.audioPath$$.asObservable();

  public baseUrl: string = '../../assets/photo/';

  public isMuted: boolean = false;

  public ngOnInit(): void {
    const animalName = this.route.snapshot.queryParams['name'];
    if (animalName) {
      this.nodeApiService.getCostumes(animalName);
    }

    this.subscription.add(this.storageService.costumes$.subscribe(data => {
      this.costumes$$.next(data);
    }));

    this.subscription.add(
      this.storageService.costumesAudio$.subscribe(path => {
        this.audioPath$$.next(path);
      })
    );
  }

  public ngAfterViewInit(): void {
    this.subscription.add(
      this.audioPath$.subscribe(audioPath => {
        if (this.backgroundAudio && this.backgroundAudio.nativeElement) {
          this.backgroundAudio.nativeElement.src = `../../assets/${audioPath}`;
          this.backgroundAudio.nativeElement.volume = this.isMuted ? 0 : 0.05;

          if (audioPath) {
            this.backgroundAudio.nativeElement.play().catch(error => {
              console.error('Error playing audio:', error);
            });
          }
          this.cdr.detectChanges();
        }
      })
    );
  }

  public goBack(): void {
    this.router.navigate([ '/home' ]);
  }

  public onCostumeClick(costume: string): void {
    const imgElement = document.getElementById(costume);

    if (imgElement) {
      const splashEffectElement = imgElement.parentElement?.querySelector('.splash-effect');
      splashEffectElement?.classList.add('active');

      const animal = this.route.snapshot.queryParams['name'];

      setTimeout(() => {
        splashEffectElement?.classList.remove('active');
        this.router.navigate(
          [ '/dress-checker' ], { queryParams: { animal, costume } }
        );
      }, 1000);
    }
  }

  public trackByCostume(index: number, costume: Animal): string {
    return costume.name;
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;

    if (this.backgroundAudio && this.backgroundAudio.nativeElement) {
      this.backgroundAudio.nativeElement.volume = this.isMuted ? 0 : 0.05;
      this.cdr.detectChanges();
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
