import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { QFButtonStyle } from '../../forms/components/button/button.component';
import { AppService } from '../../services/app.service';

@Component({
  template: ``,
})
export abstract class ScavengerRouteComponent implements OnDestroy, OnInit {

  public static BASE_PAGE_TITLE = 'Scavenger Games';
  @HostBinding('style.margin-top.rem') protected marginTop: number;
  public QFButtonStyle = QFButtonStyle;
  private navigationDisplaySubscription: Subscription;

  constructor(public appService: AppService, protected titleService: Title) {
    this.titleService.setTitle(`${ScavengerRouteComponent.BASE_PAGE_TITLE}`);
  }

  public ngOnInit(): void {
    this.navigationDisplaySubscription = this.appService.navigation$.subscribe(() => {
      if (this.appService.showNavigation) {
        this.marginTop = 4;
      } else {
        this.marginTop = undefined;
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.navigationDisplaySubscription) {
      this.navigationDisplaySubscription.unsubscribe();
      this.navigationDisplaySubscription = null;
    }
  }

}
