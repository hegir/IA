import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateFormat',
    pure: false
})
@Injectable()
export class DateFormatPipe implements PipeTransform {
    transform(value: string) {
        var datePipe = new DatePipe("en-US");
        if(value == null || value.toString().includes("0001") || value.toString().includes("1901"))
        return '-';
         value = datePipe.transform(value, 'dd.MM.yyyy');
         return value;
     }
}
