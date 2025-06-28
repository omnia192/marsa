import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OptionService {

  constructor() { }

  getMaxValue(options: any[], property: string): number {
    let maxValue = 0;
    for (const option of options) {
      if (option.PriceColective[property] > maxValue) {
        maxValue = option.PriceColective[property];
      }
    }
    return maxValue;
  }
}
