import { Injectable } from '@angular/core';
import { Brand } from '../models/brand';
import { Color } from '../models/color';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {
  private currentBrand: Brand | null = null;
  private currentColor: Color | null = null;

  // Observable for brand changes
  private brandSubject = new Subject<Brand | null>();
  brand$ = this.brandSubject.asObservable();

  // Observable for color changes
  private colorSubject = new Subject<Color | null>();
  color$ = this.colorSubject.asObservable();

  setCurrentBrand(brand: Brand) {
    // Check if the current color is set, if so, clear it first
    if (this.currentColor) {
      this.clearCurrentColor();
    }

    this.currentBrand = brand;
    this.brandSubject.next(this.currentBrand);
  }

  clearCurrentBrand() {
    this.currentBrand = null;
    this.brandSubject.next(this.currentBrand);
  }

  setCurrentColor(color: Color) {
    // Check if the current brand is set, if so, clear it first
    if (this.currentBrand) {
      this.clearCurrentBrand();
    }

    this.currentColor = color;
    this.colorSubject.next(this.currentColor);
  }

  clearCurrentColor() {
    this.currentColor = null;
    this.colorSubject.next(this.currentColor);
  }
}
