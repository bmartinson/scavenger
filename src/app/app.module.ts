import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMap, faMapSigns, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { AppRoutingModule } from './app-routing.module';
import { AboutComponent } from './components/about/about.component';
import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { IconHolderComponent } from './components/icon-holder/icon-holder.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NoClueComponent } from './components/no-clue/no-clue.component';
import { QRSearchComponent } from './components/qr-search/qr-search.component';

@NgModule({
  declarations: [
    AboutComponent,
    AppComponent,
    HomeComponent,
    IconHolderComponent,
    LoaderComponent,
    NavigationComponent,
    NoClueComponent,
    QRSearchComponent
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
      faMap,
      faMapSigns,
      faQrcode,
    );
  }

}
