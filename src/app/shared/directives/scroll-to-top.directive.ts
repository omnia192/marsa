import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appScrollToTop]'
})
export class ScrollToTopDirective {

  constructor() { }

  @HostListener('click')
  onClick() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
