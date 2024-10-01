import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Animal } from "../models/common.models";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public animals$$: BehaviorSubject<string[] | null> = new BehaviorSubject<string[] | null>(null);
  public animals$: Observable<string[] | null> = this.animals$$.asObservable();

  public costumes$$: BehaviorSubject<Animal[] | null> = new BehaviorSubject<Animal[] | null>(null);
  public costumes$: Observable<Animal[] | null> = this.costumes$$.asObservable();

  public dress$$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public dress$: Observable<string | null> = this.dress$$.asObservable();

  public costumesAudio$$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public costumesAudio$: Observable<string | null> = this.costumesAudio$$.asObservable();

  public dressAudio$$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public dressAudio$: Observable<string | null> = this.dressAudio$$.asObservable();

  public elements$$: BehaviorSubject<string[] | null> = new BehaviorSubject<string[] | null>(null);
  public elements$: Observable<string[] | null> = this.elements$$.asObservable();
}
