import { Component, Input } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';

@Component({
  selector: 'app-activity-filter',
  templateUrl: './activity-filter.component.html',
  styleUrls: ['./activity-filter.component.scss'],
})
export class ActivityFilterComponent {
  @Input() search: any;
  destination: any = [];
  constructor(private _httpsService: HttpService) {}
  ngOnInit() {
    this._httpsService.get('marsa', 'place').subscribe({
      next: (res: any) => {
        this.destination = res.places;
      },
    });
  }
}
