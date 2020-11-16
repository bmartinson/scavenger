import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faFlagCheckered, faHiking, faMap, faMapSigns, faQrcode, faRoute, faStreetView, faTimes, faUndo } from '@fortawesome/free-solid-svg-icons';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { IconHolderComponent } from './components/icon-holder/icon-holder.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NoWaypointComponent } from './components/no-waypoint/no-waypoint.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { QRFindComponent } from './components/qr-find/qr-find.component';
import { QRSearchComponent } from './components/qr-search/qr-search.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SupportComponent } from './components/support/support.component';
import { TermsComponent } from './components/terms/terms.component';
import { WaypointComponent } from './components/waypoint/waypoint.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HomeComponent,
    IconHolderComponent,
    LoaderComponent,
    NavigationComponent,
    NoWaypointComponent,
    PrivacyComponent,
    QRFindComponent,
    QRSearchComponent,
    SignUpComponent,
    SupportComponent,
    TermsComponent,
    WaypointComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private library: FaIconLibrary) {
    this.library.addIcons(
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
