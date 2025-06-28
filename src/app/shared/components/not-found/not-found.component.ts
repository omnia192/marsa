import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  currentLang: string = 'en';

  constructor(
    private router: Router,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    // Get current language
    this.languageService.getCurrentLang().subscribe(lang => {
      this.currentLang = lang;
    });
  }

  goHome() {
    this.router.navigate([this.currentLang]);
  }

  goBack() {
    window.history.back();
  }
}
