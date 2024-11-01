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
import { ActivatedRoute, Router } from "@angular/router";
import { NodeApiService } from "../../shared/services/node-api.service";
import { StorageService } from "../../shared/services/storage.service";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { CostumeElement } from "../../shared/models/common.models";

@Component({
  selector: 'app-dress-checker',
  templateUrl: './dress-checker.component.html',
  styleUrls: ['./dress-checker.component.less']
})
export class DressCheckerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('backgroundAudio') backgroundAudio!: ElementRef<HTMLAudioElement>;

  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly nodeApiService: NodeApiService = inject(NodeApiService);
  private readonly storageService: StorageService = inject(StorageService);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly router: Router = inject(Router);

  private dressPath$$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public dressPath$: Observable<string | null> = this.dressPath$$.asObservable();

  private audioPath$$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public audioPath$: Observable<string | null> = this.audioPath$$.asObservable();

  private elements$$: BehaviorSubject<CostumeElement[] | null> =
    new BehaviorSubject<CostumeElement[] | null>(null);

  public elements$: Observable<CostumeElement[] | null> = this.elements$$.asObservable();

  private allDressed$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public allDressed$: Observable<boolean> = this.allDressed$$.asObservable();

  public baseUrl = '../../assets/';
  public isMuted: boolean = false;
  public hoveredElement: CostumeElement | null = null;
  public noElementsHovered: boolean = false;
  public isBrilliantVisible = true;

  private readonly subscription: Subscription = new Subscription();

  ngOnInit(): void {
    const animal = this.route.snapshot.queryParams['animal'];
    const costume = this.route.snapshot.queryParams['costume'];

    if (animal && costume) {
      this.nodeApiService.getDress(animal, costume);
      this.nodeApiService.getCostumeElements(costume);
    }

    this.nodeApiService.getDressAudio();

    this.subscription.add(
      this.storageService.dress$.subscribe(path => {
        this.dressPath$$.next(path);
      })
    );

    this.subscription.add(
      this.storageService.dressAudio$.subscribe(path => {
        this.audioPath$$.next(path);
      })
    );

    this.subscription.add(
      this.storageService.elements$.subscribe(data => {
        const elements: CostumeElement[] = data?.map(image => ({ image })) || [];
        this.elements$$.next(elements);
      })
    );

    this.subscription.add(
      this.elements$.subscribe(elements => {
        if (elements && elements.length > 0) {
          const allDressed = elements.every(e => e.isDressedOn);
          this.allDressed$$.next(allDressed);
        } else {
          this.allDressed$$.next(false);
        }
      })
    );
  }
  // @Todo: optimize code repetition
  public ngAfterViewInit(): void {
    this.subscription.add(
      this.audioPath$.subscribe(audioPath => {
        if (this.backgroundAudio && this.backgroundAudio.nativeElement) {
          this.backgroundAudio.nativeElement.src = `../../assets/${audioPath}`;
          this.backgroundAudio.nativeElement.volume = this.isMuted ? 0 : 0.05;

          if (audioPath) {
            this.backgroundAudio.nativeElement.play().catch(error => {
              console.error(error)
            });
          }
          this.cdr.detectChanges();
        }
      })
    );
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;

    if (this.backgroundAudio && this.backgroundAudio.nativeElement) {
      this.backgroundAudio.nativeElement.volume = this.isMuted ? 0 : 0.05;
      this.cdr.detectChanges();
    }
  }

  public toggleDress(element: CostumeElement): void {
    element.isDressedOn = !element.isDressedOn;
    const currentElements = this.elements$$.getValue() || [];
    const index = currentElements.findIndex(e => e.image === element.image);
    if (index !== -1) {
      currentElements[index] = { ...currentElements[index], isDressedOn: element.isDressedOn };
      this.elements$$.next(currentElements);
    }

    if (currentElements.length > 0) {
      const allDressed = currentElements.every(e => e.isDressedOn);
      this.allDressed$$.next(allDressed);
    } else {
      this.allDressed$$.next(false);
    }
  }

  public goBack(): void {
    const name = this.route.snapshot.queryParams['animal'];
    this.router.navigate([ '/costumes' ], { queryParams: { name } });
  }

  public toggleCompleteDress(): void {
    const isAllDressed = this.allDressed$$.getValue();
    this.allDressed$$.next(!isAllDressed);
  }

  public hide(): void {
    this.isBrilliantVisible = false;
  }

  public getImageData(imageData: string) {
    //@Todo: implement logic
  }

  private resetDress(): void {
    this.storageService.dress$$.next(null);
    this.storageService.elements$$.next(null);
    this.dressPath$$.next(null);
    this.elements$$.next(null);
  }

  public ngOnDestroy(): void {
    this.resetDress();
    this.subscription.unsubscribe();
  }
}
