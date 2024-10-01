import { inject, Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class NodeApiService {
  private readonly http: HttpClient = inject<HttpClient>(HttpClient);
  private readonly storageService: StorageService = inject(StorageService);

  public getAnimals(): void {
    this.http.get<string[]>(`${environment.apiUrl}/animals`).pipe(
      map(data => {
        const updated = this.sortAnimals(data);
        this.storageService.animals$$.next(updated);
      })
    ).subscribe({
      error: error => console.error('Error fetching animals:', error)
    });
  }

  public getCostumes(animalName: string): void {
    this.http.get<{ image: string; name: string }[]>(`${environment.apiUrl}/costumes`, {
      params: { name: animalName }
    }).pipe(
      map(costumes => {
        this.storageService.costumes$$.next(costumes);
        return costumes;
      })
    ).subscribe({
      error: error => console.error(`Error fetching costumes for ${animalName}:`, error)
    });
  }

  public getDress(animal: string, costume: string): void {
    this.http.get<{ path: string }>(`${environment.apiUrl}/dress`, {
      params: { animal, costume }
    }).pipe(
      map(response => {
        this.storageService.dress$$.next(response.path);
      })
    ).subscribe({
      error: error => console.error('Error fetching dress:', error)
    });
  }

  public getCostumesAudio(): void {
    this.http.get<{ path: string }>(`${environment.apiUrl}/costumes-audio`).pipe(
      map(response => {
        this.storageService.costumesAudio$$.next(response.path);
      })
    ).subscribe({
      error: error => console.error('Error fetching costumes audio:', error)
    });
  }

  public getDressAudio(): void {
    this.http.get<{ path: string }>(`${environment.apiUrl}/dress-audio`).pipe(
      map(response => {
        this.storageService.dressAudio$$.next(response.path);
      })
    ).subscribe({
      error: error => console.error('Error fetching dress audio:', error)
    });
  }

  public getCostumeElements(costume: string): void {
    this.http.get<string[]>(`${environment.apiUrl}/costume-items`, {
      params: { costume }
    }).pipe(
      map(elements => {
        this.storageService.elements$$.next(elements);
      })
    ).subscribe({
      error: error => console.error(`Error fetching costume elements for ${costume}:`, error)
    });
  }

  private sortAnimals(data: string[]): string[] {
    const penguinImage = 'penguin.svg';
    const penguinIndex = data.indexOf(penguinImage);
    let filtered = [...data];
    if (penguinIndex > -1) {
     filtered = data.filter(image => image !== penguinImage);
      filtered.splice(1, 0, penguinImage);
    }

    return filtered;
  }
}
