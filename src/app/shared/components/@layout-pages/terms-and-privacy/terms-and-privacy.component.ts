import { Component } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-terms-and-privacy',
  templateUrl: './terms-and-privacy.component.html',
  styleUrls: ['./terms-and-privacy.component.scss'],
})
export class TermsAndPrivacyComponent {
  tabs: any = [];

  activeSection = 'section1'; // Initialize with a default value

  constructor(private httpService: HttpService, private titleService: Title,) {}

  ngOnInit() {
    this.titleService.setTitle('Terms and Privacy');

    this.httpService
      .get(environment.marsa, 'TermsPrivacy')
      .subscribe((res: any) => {
        this.tabs = res?.Terms;
        this.activeSection = res?.Terms[0].id;
      });
  }
  setActiveSection(section: string) {
    this.activeSection = section;
  }
}
