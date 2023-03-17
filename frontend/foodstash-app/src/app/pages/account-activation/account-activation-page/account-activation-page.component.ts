import {Component, OnDestroy, OnInit} from '@angular/core';
import {verifyActivationRouteParam, verifyRouteParam} from '../../../common/utils/checkRouteParams';
import {ActivatedRoute, Router, ROUTES} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication/authentication.service';
import {Subscription, timeout} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {APP_ROUTES} from '../../../core/routes.table';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-account-activation-page',
  templateUrl: './account-activation-page.component.html',
  styleUrls: ['./account-activation-page.component.scss']
})
export class AccountActivationPageComponent implements OnInit, OnDestroy {

  activationId = '';
  activationLoading = true;
  activationSuccess = false;
  subscription = new Subscription();

  constructor(private route: ActivatedRoute,
              private authService: AuthenticationService,
              private router: Router,
              private toast: ToastrService,
              private translate: TranslateService) {
    const routeId = this.route.snapshot.paramMap.get('activationId');
    if(routeId != null){
      if(verifyActivationRouteParam(routeId)){
        this.activationId = routeId;
      }
    }
  }

  ngOnInit(): void {

    if(this.activationId.length === 0){
      return;
    }

    this.subscription.add(this.authService.activateAccount(this.activationId).subscribe(
      {
        next: value => {
          this.onSuccess();
        },
        error: err => {
          this.activationLoading = false;
        }
      }
    ))
  }

  private onSuccess(){
    this.activationLoading = false;
    this.activationSuccess = true;

    const msgTitle = this.translate.instant('activationPage.msgs.successTitle');
    const msgBody = this.translate.instant('activationPage.msgs.body');

    this.toast.success(msgBody,msgTitle);

    setTimeout(() =>{
      this.router.navigate([APP_ROUTES.login]);
    }, 2000);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}


