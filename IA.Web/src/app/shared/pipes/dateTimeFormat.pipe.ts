import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateTimeFormat',
    pure: false
})
@Injectable()
export class DateTimeFormatPipe implements PipeTransform {
    transform(value: string, format:string = 'dd.MM.yyyy HH:mm') {
        var datePipe = new DatePipe("en-US");
        if(value == null || value.toString().includes("0001") || value.toString().includes("1901"))
        return '-';
         value = datePipe.transform(value, format);
         return value;
     }
}
