import { Component } from '@angular/core';

@Component({
  selector: 'app-all-packages',
  templateUrl: './all-packages.component.html',
  styleUrls: ['./all-packages.component.scss']
})
export class AllPackagesComponent {
  counter: number = 0;
  children:number=0;
  Infant:number=0;
  incrementCounter() {
    this.counter++;
  }
  decrementCounter() {
    this.counter--;
  }
  incrementChildren() {
    this.children++;
  }
  decrementChildren() {
    this.children--;
  }
  incrementInfant() {
    this.Infant++;
  }
  decrementInfant() {
    this.Infant--;
  }
}
