import { Component, OnInit } from '@angular/core';
import {APP_ROUTES} from '../../../core/routes.table';
import {map, Observable, shareReplay} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StorageTrans, StorageTransArr} from '../../../common/models/storages/storage.model';

@Component({
  selector: 'app-stash-create-page',
  templateUrl: './stash-create-page.component.html',
  styleUrls: ['./stash-create-page.component.scss']
})
export class StashCreatePageComponent implements OnInit {

  backRouterLink = APP_ROUTES.stashes;
  nextRouterLink = APP_ROUTES.stashes;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {

  }



  ngOnInit(): void {

  }


}
