import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { log } from 'console';

@Component({
  selector: 'app-tours-table',
  templateUrl: './tours-table.component.html',
  styleUrls: ['./tours-table.component.scss'],
})
export class ToursTableComponent implements OnInit, OnChanges {
  @Input() tours: any;
  activeTab: string = 'year';
  thisYear: number = new Date().getFullYear();
  filterdTours: any = [];
  selectedTour: any;
  years: { label: string; value: string }[] = [];

  ngOnInit() {
    this.filterdTours = this.tours;
    this.generateYears();
    this.activeTab = this.thisYear.toString();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.filterdTours = changes['tours']?.currentValue;
    }
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    this.years = [
      { label: 'This Year', value: currentYear.toString() },
      { label: (currentYear - 1).toString(), value: (currentYear - 1).toString() },
      { label: (currentYear - 2).toString(), value: (currentYear - 2).toString() },
      { label: (currentYear - 3).toString(), value: (currentYear - 3).toString() }
    ];
  }

  openModal(tour: any) {
    this.selectedTour = tour;
  }

  setFilter(year: string) {
    this.activeTab = year;
    this.filterdTours = this.tours?.filter((item: any) => {
      return item.time.substr(0, 4) === year;
    });
  }
}
