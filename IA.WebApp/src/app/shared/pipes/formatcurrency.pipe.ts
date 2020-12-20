import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { environment } from 'src/environments/environment';

@Pipe({
    name: 'formatCurrency'
})
@Injectable()
export class FormatCurrencyPipe implements PipeTransform {
    constructor(){

    }
    transform(value: any, defaultCurrency: string = ''): string {
        var pipe = new CurrencyPipe(environment.defaultLanguage);
        return pipe.transform(value, defaultCurrency != '' ? defaultCurrency : environment.defaultCurrency.toUpperCase() + ' ', 'symbol', null, environment.defaultLanguage);
    }
}