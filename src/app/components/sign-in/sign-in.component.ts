import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { QuickFormResponse } from '../../forms/components/form/quick-form-response';
import { AppService } from '../../services/app.service';
import { ScavengerRouteComponent } from '../scavenger-route/scavenger-route.component';

@Component({
  selector: 'scavenger-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['../../styles/route-component-base.scss', '../../styles/route-component-centered.scss']
})
export class SignInComponent extends ScavengerRouteComponent {

  public fnEmailValidator = Validators.pattern(AppService.EMAIL_REG_EX);
  public isLoading: boolean;
  public isWrongUser: boolean;

  constructor(public appService: AppService, protected titleService: Title) {
    super(appService, titleService);

    this.titleService.setTitle(`${ScavengerRouteComponent.BASE_PAGE_TITLE} - Sign In!`);

    this.isLoading = this.isWrongUser = false;
  }

  public onSignIn(response: QuickFormResponse): void {
    this.isLoading = true;
    this.isWrongUser = false;

    this.appService.signIn(response.value.ctlEmail, response.value.ctlPassword).then((data: any) => {
      console.warn('success', data);
      if (data.status === 'fail') {
        this.isWrongUser = true;
      }
    }).catch((e: any) => {
      this.isWrongUser = true;
    }).finally(() => {
      this.isLoading = false;
    });
  }

}
