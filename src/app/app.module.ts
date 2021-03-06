import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faAngleDoubleUp,
  faBook,
  faCheck,
  faFlagCheckered,
  faHiking,
  faMap,
  faMapSigns,
  faQrcode,
  faRoute,
  faStreetView,
  faTimes,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { AppRoutingModule } from './app-routing.module';
import { AccountComponent } from './components/account/account.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { IconHolderComponent } from './components/icon-holder/icon-holder.component';
import { JournalComponent } from './components/journal/journal.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NoWaypointComponent } from './components/no-waypoint/no-waypoint.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { QRFindComponent } from './components/qr-find/qr-find.component';
import { QRSearchComponent } from './components/qr-search/qr-search.component';
import { RootComponent } from './components/root/root.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SupportComponent } from './components/support/support.component';
import { TermsComponent } from './components/terms/terms.component';
import { WaypointComponent } from './components/waypoint/waypoint.component';
import { SubNavigationDirective } from './directives/sub-navigation.directive';
import { QuickFormsModule } from './forms/quick-forms.module';

@NgModule({
  declarations: [
    AccountComponent,
    FooterComponent,
    HomeComponent,
    JournalComponent,
    AccountComponent,
    IconHolderComponent,
    LoaderComponent,
    NavigationComponent,
    NoWaypointComponent,
    PrivacyComponent,
    QRFindComponent,
    QRSearchComponent,
    RootComponent,
    SignInComponent,
    SignUpComponent,
    SubNavigationDirective,
    SupportComponent,
    TermsComponent,
    WaypointComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FontAwesomeModule,
    HttpClientModule,
    QuickFormsModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule {

  constructor(private library: FaIconLibrary) {
    this.library.addIcons(
      faAngleDoubleUp,
      faBook,
      faCheck,
      faFlagCheckered,
      faHiking,
      faMap,
      faMapSigns,
      faQrcode,
      faRoute,
      faStreetView,
      faTimes,
      faUndo,
    );
  }

}
