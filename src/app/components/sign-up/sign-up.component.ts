import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { QuickFormResponse } from '../../forms/components/form/quick-form-response';
import { AppService } from '../../services/app.service';
import { ScavengerRouteComponent } from '../scavenger-route/scavenger-route.component';

@Component({
  selector: 'scavenger-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../../styles/route-component-base.scss', '../../styles/route-component-centered.scss']
})
export class SignUpComponent extends ScavengerRouteComponent {

  public fnEmailValidator = Validators.pattern(AppService.EMAIL_REG_EX);
  public isLoading: boolean;
  public isFailed: boolean;

  constructor(public appService: AppService, protected titleService: Title, private router: Router) {
    super(appService, titleService);

    // log out if we go to sign-up
    this.appService.logout();

    this.isLoading = this.isFailed = false;

    this.titleService.setTitle(`${ScavengerRouteComponent.BASE_PAGE_TITLE} - Sign Up!`);
  }

  public onSignUp(response: QuickFormResponse): void {
    this.isLoading = true;
    this.isFailed = false;

    this.appService.signUp(
      response.value.ctlEmail,
      response.value.ctlPassword,
      response.value.ctlFirstName,
      response.value.ctlLastName,
      response.value.ctlOrganization,
    ).then((data: any) => {
      console.warn('success', data);
      if (data.status === 'fail') {
        this.isFailed = true;
      } else {
        this.router.navigate(['/host']);
      }
    }).catch(() => {
      this.isFailed = true;
    }).finally(() => {
      this.isLoading = false;
    });
  }

}
