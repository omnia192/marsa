import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-liveabourd-related-card',
  templateUrl: './liveabourd-related-card.component.html',
  styleUrls: ['./liveabourd-related-card.component.scss']
})
export class LiveabourdRelatedCardComponent {
  @Input() item:any
constructor(public translate:TranslateService)
{}
getImageName(url: string): string {
  const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
  return imageName || 'Unknown photo';
}
}
