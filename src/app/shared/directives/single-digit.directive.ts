import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appSingleDigit]'
})
export class SingleDigitDirective {

  constructor(private elementRef: ElementRef) {}

  @HostListener('input') onInput() {
    const element = this.elementRef.nativeElement as HTMLInputElement;
    if (element.value.length === 1) {
      const nextInput = element.nextElementSibling as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      } else {
        // If it's the last input, prevent further input
        element.blur(); // Remove focus from the current input
      }
    }
  }
}
