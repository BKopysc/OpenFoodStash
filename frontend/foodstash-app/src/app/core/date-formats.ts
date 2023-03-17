import {MAT_DATE_LOCALE, NativeDateAdapter} from '@angular/material/core';
import {Inject, Injectable, Optional} from '@angular/core';
import {Platform} from '@angular/cdk/platform';

export const PL_DATE_FORMAT = {
  parse:{
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Injectable()
export class PlDateAdapter extends NativeDateAdapter{
  constructor(@Optional() @Inject(MAT_DATE_LOCALE) matDateLocale: string,  platform: Platform) {
    super(matDateLocale, platform);
  }

  override parse(value: string){
    let pl=value.split('.');
    if(pl.length==3)
      return new Date(+pl[2],+pl[1]-1,+pl[0],12)
    else
      return null;
  }

  override format(date: Date, displayFormat: Object): string {
      const day = date.getDate();
      const month = date.getMonth()+1;
      const year = date.getFullYear();
      return this._to2digit(day) + '.' + this._to2digit(month) + '.' + year;

    // return ('0'+date.getDate()).slice(-2)+'.'+
    //   ('0'+(date.getMonth()+1)).slice(-2)+'.'+date.getFullYear()
  }

  private _to2digit(n: number){
    return ('00' +n).slice(-2);
  }

}
