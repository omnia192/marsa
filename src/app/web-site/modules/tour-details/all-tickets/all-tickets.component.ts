import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-tickets',
  templateUrl: './all-tickets.component.html',
  styleUrls: ['./all-tickets.component.scss']
})
export class AllTicketsComponent implements OnInit {
  AllActivities: any[] = [];
  visibleActivities: any[] = [];
  itemsToShow: number = 6;
  loading: boolean = false;
  name: any;
  overview:any;

  ngOnInit() {
    if (typeof window !== 'undefined') {

      const storedSight = localStorage.getItem('selectedSight');
      if (storedSight) {
        this.name=JSON.parse(storedSight).name;
        this.overview=JSON.parse(storedSight).short_overveiw;
        this.AllActivities = JSON.parse(storedSight).trips;
        this.showMore();
      }
    }
  }

  showMore(): void {
    this.loading = true;
    setTimeout(() => {
      const startIndex = this.visibleActivities.length;
      const nextItems = this.AllActivities.slice(startIndex, startIndex + this.itemsToShow);
      this.visibleActivities = [...this.visibleActivities, ...nextItems];
      this.loading = false;
    }, 500);  // يمكنك تعديل التأخير هنا كما ترغب
  }
}
