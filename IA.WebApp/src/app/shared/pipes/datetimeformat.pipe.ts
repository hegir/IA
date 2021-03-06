import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateTimeFormat',
    pure: false
})
@Injectable()
export class DateTimeFormatPipe implements PipeTransform {
    transform(value: string, format:string = null) {
        var datePipe = new DatePipe("en-EN");
        if(value == null || value.toString().includes("0001") || value.toString().includes("1901"))
            return '-';
        if(format == null)
         value = datePipe.transform(value, 'dd.MM.yyyy HH:mm');
         else
         value = datePipe.transform(value, format);
         return value;
     }
}