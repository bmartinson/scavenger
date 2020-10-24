import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppPreloadingStrategyService implements PreloadingStrategy {

  public preloadedModules: string[] = [];

  public preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data.preload) {
      // add the route path to the preloaded module array
      this.preloadedModules.push(route.path);

      return load();
    } else {
      return of(null);
    }
  }

}
