import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMap, faMapSigns, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { IconHolderComponent } from './components/icon-holder/icon-holder.component';
import { LoaderComponent } from './components/loader/loader.component';
import { QRSearchComponent } from './components/qr-search/qr-search.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    IconHolderComponent,
    LoaderComponent,
    QRSearchComponent
  ],
  imports: [
    AppRoutingModule,
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
