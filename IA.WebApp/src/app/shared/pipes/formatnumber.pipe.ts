import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';


@Pipe({
   name: 'formatNumber'
})
@Injectable()
export class FormatNumberPipe implements PipeTransform {
   transform(value: any, decimals: number = 0): string {


       var pipe = new DecimalPipe('en');
       if (decimals > 0) {
           return pipe.transform(value, `1.${decimals}-${decimals}`, 'en');
       }
       else {
           return pipe.transform(value, `0.${2}`, 'en');
       }
   }
}