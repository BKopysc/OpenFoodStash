import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication/authentication.service';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {verifyActivationRouteParam} from '../../../common/utils/checkRouteParams';
import {StashService} from '../../../services/stash/stash.service';
import {APP_ROUTES} from '../../../core/routes.table';

@Component({
  selector: 'app-stash-share-accept-page',
  templateUrl: './stash-share-accept-page.component.html',
  styleUrls: ['./stash-share-accept-page.component.scss']
})
export class StashShareAcceptPageComponent implements OnInit, OnDestroy {

  inviteToken = '';
  acceptLoading = true;
  acceptSuccess = false;
  subscription = new Subscription();

  constructor(private route: ActivatedRoute,
              private stashService: StashService,
              private router: Router,
              private toast: ToastrService,
              private translate: TranslateService) {
    const routeParam = this.route.snapshot.paramMap.get('inviteToken');
    if(routeParam != null){
      if(verifyActivationRouteParam(routeParam)){
        this.inviteToken = routeParam;
      }
    }
  }

  ngOnInit(): void {

    if(this.inviteToken.length === 0){
      return;
    }

    this.subscription.add(this.stashService.acceptStashShareInvitation(this.inviteToken)
      .subscribe({
        next: value => {
          this.onSuccess();
        },
        error: err => {
          this.acceptSuccess = false;
          this.acceptLoading =false;
        }
      }))
  }

  private onSuccess(){
    this.acceptLoading = false;
    this.acceptSuccess = true;

    const msgTitle = this.translate.instant('stashShareAccept.msgs.success.title');
    const msgBody = this.translate.instant('stashShareAccept.msgs.success.subtitle');

    this.toast.success(msgBody,msgTitle);

    setTimeout(() =>{
      this.router.navigate([APP_ROUTES.stashes]);
    }, 2000);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
