import {Injectable} from '@angular/core';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class CustomPaginatorImpl implements MatPaginatorIntl {

  changes = new Subject<void>();

  itemsPerPageLabel: string;
  lastPageLabel: string;
  nextPageLabel: string;
  previousPageLabel: string;
  firstPageLabel: string;

  constructor(private translateService: TranslateService) {
    this.itemsPerPageLabel = translateService.instant('paginator.itemsPerPageLabel');
    this.lastPageLabel = translateService.instant('paginator.lastPageLabel');
    this.nextPageLabel = translateService.instant('paginator.nextPageLabel');
    this.previousPageLabel = translateService.instant('paginator.previousPageLabel');
    this.firstPageLabel = translateService.instant('paginator.firstPageLabel');
  }



  getRangeLabel(page: number, pageSize: number, length: number): string {
    if(length === 0){
      return this.translateService.instant('paginator.pageOneOne')
    }
    const amountPages = Math.ceil(length/pageSize);
    return this.translateService.instant('paginator.pageOfOf', {first: page+1, second: amountPages});
  }

}
