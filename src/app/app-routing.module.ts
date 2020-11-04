import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from './can-activate.guard';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { NoClueComponent } from './components/no-clue/no-clue.component';
import { AppPreloadingStrategyService } from './services/app-preloading-strategy.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [CanActivateGuard]
  },
  {
    path: 'about',
    component: AboutComponent,
    canActivate: [CanActivateGuard]
  },
  {
    path: 'no-clue',
    component: NoClueComponent,
    canActivate: [CanActivateGuard]
  },
  {
    path: '**',
    redirectTo: 'no-clue'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {
      enableTracing: false,
      preloadingStrategy: AppPreloadingStrategyService
    }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
