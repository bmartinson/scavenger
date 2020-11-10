import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faMap, faMapSigns, faQrcode, faRoute, faStreetView, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AppRoutingModule } from './app-routing.module';
import { AboutComponent } from './components/about/about.component';
import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { IconHolderComponent } from './components/icon-holder/icon-holder.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NoWaypointComponent } from './components/no-waypoint/no-waypoint.component';
import { QRFindComponent } from './components/qr-find/qr-find.component';
import { QRSearchComponent } from './components/qr-search/qr-search.component';
import { WaypointComponent } from './components/waypoint/waypoint.component';

@NgModule({
  declarations: [
    AboutComponent,
    AppComponent,
    HomeComponent,
    IconHolderComponent,
    LoaderComponent,
    NavigationComponent,
    NoWaypointComponent,
    QRFindComponent,
    QRSearchComponent,
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
      faMap,
      faMapSigns,
      faQrcode,
      faRoute,
      faStreetView,
      faTimes,
    );
  }

}
