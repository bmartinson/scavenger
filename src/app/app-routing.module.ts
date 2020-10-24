import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from './can-activate.guard';
import { HomeComponent } from './components/home/home.component';
import { AppPreloadingStrategyService } from './services/app-preloading-strategy.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [CanActivateGuard]
  },
  {
    path: '**',
    redirectTo: ''
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
