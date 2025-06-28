import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomDateAdapter, CUSTOM_DATE_FORMATS } from './components/Date/custom-date-adapter';
import { CarouselModule as CarouselModule } from 'ngx-owl-carousel-o';
import { QuickSearchComponent } from './components/@layout-pages/quick-search/quick-search.component';
import { DestinationComponent } from './components/@layout-pages/destination/destination.component';
import { PacakagesSearchComponent } from './components/@layout-pages/pacakages-search/pacakages-search.component';
import { BannerComponent } from './components/@layout-pages/banner/banner.component';
import { ClientsComponent } from './components/@layout-pages/clients/clients.component';
import { TrendingComponent } from './components/@layout-pages/trending/trending.component';
import { FooterComponent } from './components/@layout-pages/footer/footer.component';
import { HeaderComponent } from './components/@layout-pages/header/header.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './components/@layout-pages/Auth/login/login.component';
import { RegisterComponent } from './components/@layout-pages/Auth/register/register.component';
import { NavbarComponent } from './components/@layout-pages/navbar/navbar.component';
import { HeaderTransComponent } from './components/@layout-pages/header-trans/header-trans.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ResetComponent } from './components/@layout-pages/Auth/reset/reset/reset.component';
import { OtpComponent } from './components/@layout-pages/Auth/otp/otp/otp.component';
import { NewPasswordComponent } from './components/@layout-pages/Auth/newpassword/new-password/new-password.component';
import { DoneComponent } from './components/@layout-pages/Auth/done/done/done.component';
import { UpcomingComponent } from './components/upcoming/upcoming/upcoming.component';
import { BookingUsComponent } from './components/@layout-pages/booking/booking-us/booking-us.component';
import { ApplicationComponent } from './components/@layout-pages/application/application/application.component';
import { CodeSignComponent } from './components/@layout-pages/Auth/code-sign/code-sign.component';
import { ActivityCardComponent } from './components/cards/activity-card/activity-card.component';
import { ActivityCardListComponent } from './components/cards/activity-card-list/activity-card-list.component';
import { MaterialModule } from '../material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ScrollToTopDirective } from './directives/scroll-to-top.directive';
import { MapModalComponent } from './components/@layout-pages/map-modal/map-modal.component';
import { LiveabourdCardComponent } from './components/cards/liveabourd-card/liveabourd-card.component';
import { LiveabourdRelatedCardComponent } from './components/cards/liveabourd-related-card/liveabourd-related-card.component';
import { SingleDigitDirective } from './directives/single-digit.directive';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { BoatCardComponent } from './components/cards/boat-card/boat-card.component';
import { BoatSliderModalComponent } from './sliders/boat-slider-modal/boat-slider-modal.component';
import { ImageSliderModalComponent } from './sliders/image-slider-modal/image-slider-modal.component';
import { CabinInfoModalComponent } from './sliders/cabin-info-modal/cabin-info-modal.component';
import { PackageCardComponent } from './components/cards/package-card/package-card.component';
import { BreadcrumbComponent } from './components/user-dashboard-cards/breadcrumb/breadcrumb.component';
import { UserCardComponent } from './components/user-dashboard-cards/user-card/user-card.component';
import { OverviewCardComponent } from './components/user-dashboard-cards/overview-card/overview-card.component';
import { UserSettingsComponent } from './components/user-dashboard-cards/user-settings/user-settings.component';
import { PackageSliderModalComponent } from './sliders/package-slider-modal/package-slider-modal.component';

import { ToursComponent } from './components/user-dashboard-cards/tours/tours.component';
import { LiveboardComponent } from './components/user-dashboard-cards/liveboard/liveboard.component';
import { PackagesComponent } from './components/user-dashboard-cards/packages/packages.component';
import { TransportsComponent } from './components/user-dashboard-cards/transports/transports.component';

import { ToursTableComponent } from './components/user-dashboard-cards/tours-table/tours-table.component';
import { PackageEditComponent } from './components/@layout-pages/package-edit/package-edit.component';
import { WishListComponent } from './components/@layout-pages/wish-list/wish-list.component';
import { SingleWishlistComponent } from './components/@layout-pages/single-wishlist/single-wishlist.component';
import { UpcomingBookingComponent } from './components/@layout-pages/booking/upcoming-booking/upcoming-booking.component';
import { VouchersComponent } from './components/@layout-pages/booking/vouchers/vouchers.component';
import { AppDownloadComponent } from './components/@layout-pages/booking/app-download/app-download.component';
import { MultiStepFormComponent } from './components/@layout-pages/transfer-multi-step-form/multi-step-form/multi-step-form.component';
import { StepOneComponent } from './components/@layout-pages/transfer-multi-step-form/step-one/step-one.component';
import { StepTwoComponent } from './components/@layout-pages/transfer-multi-step-form/step-two/step-two.component';
import { StepThreeComponent } from './components/@layout-pages/transfer-multi-step-form/step-three/step-three.component';
import { StepFourComponent } from './components/@layout-pages/transfer-multi-step-form/step-four/step-four.component';
import { TermsAndPrivacyComponent } from './components/@layout-pages/terms-and-privacy/terms-and-privacy.component';
import { SearchBoatComponent } from './components/@layout-pages/quick-search/search-boat/search-boat.component';
import { SearchToursComponent } from './components/@layout-pages/quick-search/search-tours/search-tours.component';
import { SearchTransferComponent } from './components/@layout-pages/quick-search/search-transfer/search-transfer.component';
import { SearchLiveComponent } from './components/@layout-pages/quick-search/search-live/search-live.component';
import { CarouselModule as CarouselModule2 } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CalendarModule } from 'primeng/calendar';
import { NgxSpinnerModule } from 'ngx-spinner';
const layoutPages = [
  QuickSearchComponent,
  SearchBoatComponent,
  SearchToursComponent,
  SearchTransferComponent,
  SearchLiveComponent,
  DestinationComponent,
  PacakagesSearchComponent,
  TrendingComponent,
  BannerComponent,
  ClientsComponent,
  FooterComponent,
  HeaderComponent,
  LoginComponent,
  RegisterComponent,

  NavbarComponent,
  HeaderTransComponent,
  ResetComponent,
  OtpComponent,
  NewPasswordComponent,
  DoneComponent,
  UpcomingComponent,
  BookingUsComponent,
  ApplicationComponent,
  CodeSignComponent,
  MapModalComponent,
];

const cardComponents = [
  ActivityCardComponent,
  ActivityCardListComponent,
  LiveabourdCardComponent,
  LiveabourdRelatedCardComponent,
  BoatCardComponent,
  PackageCardComponent,
  BreadcrumbComponent,
  UserCardComponent,
  OverviewCardComponent,
  UserSettingsComponent,

  ToursComponent,
  LiveboardComponent,
  PackagesComponent,
  TransportsComponent,

  ToursTableComponent,
  WishListComponent,
  SingleWishlistComponent,
  PackageEditComponent,
  UpcomingBookingComponent,
  VouchersComponent,
  AppDownloadComponent,
  MultiStepFormComponent,
  StepOneComponent,
  StepTwoComponent,
  StepThreeComponent,
  StepFourComponent,
  TermsAndPrivacyComponent,
];

const directives = [SingleDigitDirective, ScrollToTopDirective];

const slider = [
  BoatSliderModalComponent,
  ImageSliderModalComponent,
  CabinInfoModalComponent,
  PackageSliderModalComponent,
];

@NgModule({
  declarations: [
    ...layoutPages,
    ...cardComponents,
    ...directives,
    ...slider,
    NotFoundComponent,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    CalendarModule,
    NgxMaterialTimepickerModule,
    GoogleMapsModule,
    CommonModule,
    CarouselModule,
    ButtonModule ,
    TagModule ,
    CarouselModule2,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    TranslateModule,

    NgSelectModule,
    NgxIntlTelInputModule,
  ],
  exports: [
    NgxSpinnerModule,
    CarouselModule,
    NgxMaterialTimepickerModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ...layoutPages,
    ...cardComponents,
    ...slider,
    NgSelectModule,
    NgxIntlTelInputModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class SharedModule {}
